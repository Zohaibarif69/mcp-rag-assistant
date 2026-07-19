import json
from contextlib import asynccontextmanager
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from . import config, db, rag
from .llm import stream_response
from .mcp_client import mcp_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db()
    await mcp_manager.connect_all()
    yield
    await mcp_manager.close()


app = FastAPI(title="RAG + MCP Chat Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this for production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------
# Conversations
# ---------------------------------------------------------------------

class CreateConversationRequest(BaseModel):
    title: str = "New conversation"


class RenameConversationRequest(BaseModel):
    title: str


class PinConversationRequest(BaseModel):
    is_pinned: bool


@app.get("/api/conversations")
async def list_conversations():
    return db.list_conversations()


@app.post("/api/conversations")
async def create_conversation(req: CreateConversationRequest):
    return db.create_conversation(req.title)


@app.get("/api/conversations/{conversation_id}/messages")
async def get_messages(conversation_id: str):
    if not db.get_conversation(conversation_id):
        raise HTTPException(404, "Conversation not found")
    return db.list_messages(conversation_id)


@app.patch("/api/conversations/{conversation_id}")
async def rename_conversation(conversation_id: str, req: RenameConversationRequest):
    if not db.get_conversation(conversation_id):
        raise HTTPException(404, "Conversation not found")
    db.rename_conversation(conversation_id, req.title)
    return db.get_conversation(conversation_id)


@app.patch("/api/conversations/{conversation_id}/pin")
async def pin_conversation(conversation_id: str, req: PinConversationRequest):
    if not db.get_conversation(conversation_id):
        raise HTTPException(404, "Conversation not found")
    db.set_pinned(conversation_id, req.is_pinned)
    return db.get_conversation(conversation_id)


@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    db.delete_conversation(conversation_id)
    rag.clear_conversation_documents(conversation_id)
    return {"status": "deleted"}


# ---------------------------------------------------------------------
# Chat (streaming)
# ---------------------------------------------------------------------

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    conversation_id: str
    messages: list[ChatMessage]
    use_rag: bool = True


@app.get("/api/health")
async def health():
    return {"status": "ok", "llm_provider": config.LLM_PROVIDER}


@app.post("/api/chat")
async def chat(req: ChatRequest):
    if not req.messages:
        raise HTTPException(400, "messages cannot be empty")
    if not db.get_conversation(req.conversation_id):
        raise HTTPException(404, "Conversation not found")

    last_user_message = req.messages[-1].content
    # Persist the user's message right away.
    db.add_message(req.conversation_id, "user", last_user_message)

    retrieved = rag.retrieve(last_user_message, req.conversation_id) if req.use_rag else []
    history = [{"role": m.role, "content": m.content} for m in req.messages]

    async def event_stream():
        # Send the citation list up front so the UI can render footnote
        # markers as text streams in, without waiting for the end.
        citations = [
            {"index": i + 1, "source": r["source"], "snippet": r["text"], "score": r["score"]}
            for i, r in enumerate(retrieved)
        ]
        yield f"data: {json.dumps({'type': 'citations', 'citations': citations})}\n\n"

        full_text = ""
        async for event in stream_response(history, retrieved):
            if event["type"] == "text":
                full_text += event["delta"]
            yield f"data: {json.dumps(event)}\n\n"

        # Persist the assistant's full message once streaming is done.
        db.add_message(
            req.conversation_id,
            "assistant",
            full_text,
            citations_json=json.dumps(citations) if citations else None,
        )
        yield f"data: {json.dumps({'type': 'stream_end'})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# ---------------------------------------------------------------------
# Documents (RAG, scoped per conversation)
# ---------------------------------------------------------------------

@app.post("/api/upload")
async def upload(conversation_id: str = Form(...), file: UploadFile = File(...)):
    if not db.get_conversation(conversation_id):
        raise HTTPException(404, "Conversation not found")

    suffix = Path(file.filename).suffix.lower()
    if suffix not in {".pdf", ".txt", ".md", ".docx"}:
        raise HTTPException(400, f"Unsupported file type: {suffix}")

    dest = config.UPLOAD_DIR / f"{uuid4().hex}_{file.filename}"
    contents = await file.read()
    dest.write_bytes(contents)

    result = rag.ingest_file(dest, conversation_id=conversation_id, source_name=file.filename)
    return result


@app.get("/api/documents")
async def documents(conversation_id: str):
    return {"sources": rag.list_sources(conversation_id)}


@app.delete("/api/documents")
async def clear_documents(conversation_id: str):
    rag.clear_conversation_documents(conversation_id)
    return {"status": "cleared"}
