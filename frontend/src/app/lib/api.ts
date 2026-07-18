import type { Citation, Message } from "../types";

// ---- Conversations -----------------------------------------------------

export interface ConversationRecord {
  id: string;
  title: string;
  is_pinned: boolean;
  created_at: number;
  updated_at: number;
}

export async function listConversations(): Promise<ConversationRecord[]> {
  const res = await fetch("/api/conversations");
  if (!res.ok) throw new Error(`Failed to list conversations: ${res.status}`);
  return res.json();
}

export async function createConversation(title = "New conversation"): Promise<ConversationRecord> {
  const res = await fetch("/api/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Failed to create conversation: ${res.status}`);
  return res.json();
}

export async function renameConversation(id: string, title: string): Promise<ConversationRecord> {
  const res = await fetch(`/api/conversations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Failed to rename conversation: ${res.status}`);
  return res.json();
}

export async function pinConversation(id: string, isPinned: boolean): Promise<ConversationRecord> {
  const res = await fetch(`/api/conversations/${id}/pin`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_pinned: isPinned }),
  });
  if (!res.ok) throw new Error(`Failed to pin conversation: ${res.status}`);
  return res.json();
}

export async function deleteConversation(id: string): Promise<void> {
  const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete conversation: ${res.status}`);
}

interface BackendMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
  created_at: number;
}

export async function getConversationMessages(id: string): Promise<Message[]> {
  const res = await fetch(`/api/conversations/${id}/messages`);
  if (!res.ok) throw new Error(`Failed to load messages: ${res.status}`);
  const data: BackendMessage[] = await res.json();
  return data.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    timestamp: new Date(m.created_at * 1000),
    citations: m.citations?.length ? m.citations : undefined,
  }));
}

// ---- Streaming chat ------------------------------------------------------

export interface StreamHandlers {
  onCitations?: (citations: Citation[]) => void;
  onDelta?: (text: string) => void;
  onToolCall?: (name: string) => void;
  onDone?: () => void;
}

/**
 * Streams a chat reply token-by-token via fetch + ReadableStream (the
 * backend sends Server-Sent-Events-formatted lines over a plain POST
 * response, so we parse it ourselves rather than using EventSource,
 * which can't send a POST body).
 */
export async function streamChat(
  conversationId: string,
  messages: Message[],
  handlers: StreamHandlers
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_id: conversationId,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      use_rag: true,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Chat request failed: ${res.status} ${await res.text()}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const raw of events) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;

      let event: { type: string; delta?: string; citations?: Citation[]; name?: string };
      try {
        event = JSON.parse(payload);
      } catch {
        continue;
      }

      if (event.type === "citations" && event.citations) {
        handlers.onCitations?.(event.citations);
      } else if (event.type === "text" && event.delta) {
        handlers.onDelta?.(event.delta);
      } else if (event.type === "tool_call" && event.name) {
        handlers.onToolCall?.(event.name);
      } else if (event.type === "stream_end") {
        handlers.onDone?.();
      }
    }
  }
}

// ---- Documents (RAG, scoped per conversation) ---------------------------

export async function uploadDocument(
  conversationId: string,
  file: File
): Promise<{ source: string; chunks_added: number }> {
  const formData = new FormData();
  formData.append("conversation_id", conversationId);
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function listDocuments(conversationId: string): Promise<string[]> {
  const res = await fetch(`/api/documents?conversation_id=${encodeURIComponent(conversationId)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.sources ?? [];
}
