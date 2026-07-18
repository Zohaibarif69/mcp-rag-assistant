"""
Central configuration, loaded from environment variables (.env).
Keeping every provider-specific / infra choice here means swapping
LLM providers or adding MCP servers never touches the rest of the app.
"""
import json
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
CHROMA_DIR = DATA_DIR / "chroma"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
CHROMA_DIR.mkdir(parents=True, exist_ok=True)

# ---- LLM provider ----------------------------------------------------
# "anthropic" | "openai" | "gemini" | "ollama"
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "anthropic")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Gemini API key from Google AI Studio (https://aistudio.google.com/apikey)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

# ---- RAG ---------------------------------------------------------------
# Local embedding model -> no extra API key needed, works no matter which
# LLM provider above is chosen.
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "800"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "120"))
RAG_TOP_K = int(os.getenv("RAG_TOP_K", "4"))
# How many candidates to pull from the vector DB before reranking down to RAG_TOP_K.
RAG_CANDIDATE_K = int(os.getenv("RAG_CANDIDATE_K", "20"))
RERANK_MODEL = os.getenv("RERANK_MODEL", "cross-encoder/ms-marco-MiniLM-L-6-v2")
COLLECTION_NAME = "documents"

# ---- Conversation persistence (SQLite) -------------------------------
DB_PATH = os.getenv("DB_PATH", str(DATA_DIR / "app.db"))

# ---- MCP -----------------------------------------------------------
# List of MCP servers to connect to, defined in mcp_servers.json so
# people can add/remove servers without touching Python code.
MCP_SERVERS_CONFIG = BASE_DIR / "mcp_servers.json"


def load_mcp_servers() -> list[dict]:
    if not MCP_SERVERS_CONFIG.exists():
        return []
    with open(MCP_SERVERS_CONFIG) as f:
        data = json.load(f)
    return data.get("servers", [])
