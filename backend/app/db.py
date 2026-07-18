"""
Conversation + message persistence, plain sqlite3 (no ORM needed at this
scale). Conversations are the scoping unit for RAG documents too — each
uploaded file is tied to the conversation it was uploaded in.
"""
from __future__ import annotations

import sqlite3
import time
import uuid
from contextlib import contextmanager

from . import config

SCHEMA = """
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    is_pinned INTEGER NOT NULL DEFAULT 0,
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    citations_json TEXT,
    created_at REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id);
"""


@contextmanager
def get_conn():
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_conn() as conn:
        conn.executescript(SCHEMA)


def create_conversation(title: str = "New conversation") -> dict:
    now = time.time()
    conv_id = str(uuid.uuid4())
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO conversations (id, title, is_pinned, created_at, updated_at) VALUES (?, ?, 0, ?, ?)",
            (conv_id, title, now, now),
        )
    return {"id": conv_id, "title": title, "is_pinned": False, "created_at": now, "updated_at": now}


def list_conversations() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM conversations ORDER BY is_pinned DESC, updated_at DESC"
        ).fetchall()
    return [dict(r) for r in rows]


def get_conversation(conv_id: str) -> dict | None:
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM conversations WHERE id = ?", (conv_id,)).fetchone()
    return dict(row) if row else None


def rename_conversation(conv_id: str, title: str):
    with get_conn() as conn:
        conn.execute(
            "UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?",
            (title, time.time(), conv_id),
        )


def set_pinned(conv_id: str, pinned: bool):
    with get_conn() as conn:
        conn.execute(
            "UPDATE conversations SET is_pinned = ?, updated_at = ? WHERE id = ?",
            (int(pinned), time.time(), conv_id),
        )


def touch_conversation(conv_id: str):
    with get_conn() as conn:
        conn.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (time.time(), conv_id))


def delete_conversation(conv_id: str):
    with get_conn() as conn:
        conn.execute("DELETE FROM messages WHERE conversation_id = ?", (conv_id,))
        conn.execute("DELETE FROM conversations WHERE id = ?", (conv_id,))


def add_message(conv_id: str, role: str, content: str, citations_json: str | None = None) -> dict:
    import json as _json

    now = time.time()
    msg_id = str(uuid.uuid4())
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO messages (id, conversation_id, role, content, citations_json, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (msg_id, conv_id, role, content, citations_json, now),
        )
        conn.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (now, conv_id))
    return {
        "id": msg_id,
        "conversation_id": conv_id,
        "role": role,
        "content": content,
        "citations": _json.loads(citations_json) if citations_json else [],
        "created_at": now,
    }


def list_messages(conv_id: str) -> list[dict]:
    import json as _json

    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC", (conv_id,)
        ).fetchall()
    out = []
    for r in rows:
        d = dict(r)
        raw = d.pop("citations_json")
        d["citations"] = _json.loads(raw) if raw else []
        out.append(d)
    return out
