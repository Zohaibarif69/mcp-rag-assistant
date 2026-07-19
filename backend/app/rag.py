"""
RAG pipeline.

ingest_file()  -> chunk a PDF/TXT/MD/DOCX file (heading/paragraph aware)
                  and store embeddings in Chroma, scoped to a conversation
retrieve()     -> embed a query, pull a wider candidate set from the vector
                  DB, then rerank with a cross-encoder down to the final
                  top-k, scoped to that same conversation

Uses a local sentence-transformers model for embeddings (works no matter
which LLM provider is chosen for generation) and a local cross-encoder for
reranking (no extra API calls or cost).
"""
from __future__ import annotations

import re
import uuid
from pathlib import Path

import chromadb

from . import config

_embedder = None
_reranker = None
_chroma_client = None
_collection = None


def _get_embedder():
    global _embedder
    if _embedder is None:
        from sentence_transformers import SentenceTransformer

        _embedder = SentenceTransformer(config.EMBEDDING_MODEL)
    return _embedder


def _get_reranker():
    global _reranker
    if _reranker is None:
        from sentence_transformers import CrossEncoder

        _reranker = CrossEncoder(config.RERANK_MODEL)
    return _reranker


def _get_collection():
    global _chroma_client, _collection
    if _collection is None:
        _chroma_client = chromadb.PersistentClient(path=str(config.CHROMA_DIR))
        _collection = _chroma_client.get_or_create_collection(config.COLLECTION_NAME)
    return _collection


def _extract_text(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        from pypdf import PdfReader

        reader = PdfReader(str(path))
        return "\n\n".join(page.extract_text() or "" for page in reader.pages)
    if suffix == ".docx":
        import docx

        doc = docx.Document(str(path))
        return "\n\n".join(p.text for p in doc.paragraphs)
    return path.read_text(errors="ignore")


# ---- Structure-aware chunking -----------------------------------------
#
# Rather than slicing every N characters mid-sentence, split on structural
# boundaries first (paragraphs), then sentences, and only fall back to a
# hard character cut for a single run-on block that's still too big.
# Adjacent small pieces get merged up to CHUNK_SIZE so we don't end up
# with a flood of tiny chunks either.

_SENTENCE_RE = re.compile(r"(?<=[.!?])\s+")


def _split_into_paragraphs(text: str) -> list[str]:
    text = text.replace("\r\n", "\n")
    paragraphs = re.split(r"\n\s*\n", text)
    return [p.strip() for p in paragraphs if p.strip()]


def _split_long_paragraph(paragraph: str, size: int) -> list[str]:
    if len(paragraph) <= size:
        return [paragraph]
    sentences = _SENTENCE_RE.split(paragraph)
    pieces, current = [], ""
    for sentence in sentences:
        candidate = f"{current} {sentence}".strip() if current else sentence
        if len(candidate) <= size:
            current = candidate
        else:
            if current:
                pieces.append(current)
            if len(sentence) > size:
                for i in range(0, len(sentence), size):
                    pieces.append(sentence[i : i + size])
                current = ""
            else:
                current = sentence
    if current:
        pieces.append(current)
    return pieces


def smart_chunk(text: str, size: int | None = None, overlap: int | None = None) -> list[str]:
    """Paragraph/sentence-aware chunking with a small char overlap between
    adjacent chunks so context isn't lost right at a boundary."""
    size = size or config.CHUNK_SIZE
    overlap = overlap or config.CHUNK_OVERLAP

    paragraphs = _split_into_paragraphs(text)
    units: list[str] = []
    for p in paragraphs:
        units.extend(_split_long_paragraph(p, size))

    # Greedily merge consecutive units up to `size`, so short headings /
    # short paragraphs don't each become their own tiny chunk.
    chunks: list[str] = []
    current = ""
    for unit in units:
        candidate = f"{current}\n\n{unit}".strip() if current else unit
        if len(candidate) <= size or not current:
            current = candidate
        else:
            chunks.append(current)
            tail = current[-overlap:] if overlap else ""
            current = f"{tail}\n\n{unit}".strip() if tail else unit
    if current:
        chunks.append(current)

    return [c for c in chunks if c.strip()]


def ingest_file(path: Path, conversation_id: str, source_name: str | None = None) -> dict:
    """Chunk a document and add its embeddings to the vector store, scoped
    to a single conversation."""
    text = _extract_text(path)
    chunks = smart_chunk(text)
    if not chunks:
        return {"source": source_name or path.name, "chunks_added": 0}

    embedder = _get_embedder()
    embeddings = embedder.encode(chunks).tolist()
    collection = _get_collection()

    ids = [str(uuid.uuid4()) for _ in chunks]
    metadatas = [
        {
            "source": source_name or path.name,
            "chunk_index": i,
            "conversation_id": conversation_id,
        }
        for i in range(len(chunks))
    ]

    collection.add(ids=ids, embeddings=embeddings, documents=chunks, metadatas=metadatas)
    return {"source": source_name or path.name, "chunks_added": len(chunks)}


def retrieve(query: str, conversation_id: str, top_k: int | None = None) -> list[dict]:
    """Vector search for a wide candidate set (scoped to this conversation),
    then cross-encoder rerank down to the final top-k. Returns chunk text +
    source + chunk_index + score so the UI can cite the exact snippet used."""
    collection = _get_collection()
    if collection.count() == 0:
        return []

    top_k = top_k or config.RAG_TOP_K
    embedder = _get_embedder()
    query_embedding = embedder.encode([query]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=config.RAG_CANDIDATE_K,
        where={"conversation_id": conversation_id},
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    if not documents:
        return []

    # Rerank candidates against the actual query with a cross-encoder —
    # much better at judging relevance than raw embedding cosine distance,
    # especially for short/keyword-heavy queries.
    reranker = _get_reranker()
    pairs = [[query, doc] for doc in documents]
    scores = reranker.predict(pairs)

    ranked = sorted(zip(documents, metadatas, scores), key=lambda x: x[2], reverse=True)
    top = ranked[:top_k]

    return [
        {
            "text": doc,
            "source": meta.get("source"),
            "chunk_index": meta.get("chunk_index"),
            "score": float(score),
        }
        for doc, meta, score in top
    ]


def list_sources(conversation_id: str) -> list[str]:
    collection = _get_collection()
    if collection.count() == 0:
        return []
    result = collection.get(where={"conversation_id": conversation_id}, include=["metadatas"])
    metas = result["metadatas"]
    return sorted({m["source"] for m in metas})


def clear_conversation_documents(conversation_id: str):
    collection = _get_collection()
    if collection.count() == 0:
        return
    existing = collection.get(where={"conversation_id": conversation_id}, include=[])
    if existing["ids"]:
        collection.delete(ids=existing["ids"])
