import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import {
  createConversation,
  deleteConversation as apiDeleteConversation,
  getConversationMessages,
  listConversations,
  streamChat,
  uploadDocument,
  type ConversationRecord,
} from "../lib/api";
import type { Conversation, Message } from "../types";

function toConversation(record: ConversationRecord, messages: Message[] = []): Conversation {
  return {
    id: record.id,
    title: record.title,
    messages,
    createdAt: new Date(record.created_at * 1000),
    updatedAt: new Date(record.updated_at * 1000),
    isPinned: record.is_pinned,
  };
}

function formatErrorReply(err: unknown): string {
  const detail = err instanceof Error ? err.message : String(err);
  return `Sorry, I couldn't reach the backend (${detail}). Make sure the FastAPI server is running (\`uvicorn app.main:app --reload\` inside \`backend/\`) and that your \`.env\` has a valid API key.`;
}

export function ChatPage() {
  const { darkMode, toggleDark } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const loadedMessageIds = useRef<Set<string>>(new Set());

  // Load the conversation list from the backend once on mount.
  useEffect(() => {
    (async () => {
      try {
        const records = await listConversations();
        setConversations(records.map((r) => toConversation(r)));
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  // Lazily fetch messages for a conversation the first time it's opened.
  useEffect(() => {
    if (!activeId || loadedMessageIds.current.has(activeId)) return;
    loadedMessageIds.current.add(activeId);
    (async () => {
      try {
        const messages = await getConversationMessages(activeId);
        setConversations((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, messages } : c))
        );
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    })();
  }, [activeId]);

  const handleNewChat = async () => {
    try {
      const record = await createConversation();
      loadedMessageIds.current.add(record.id); // fresh chat, no messages to fetch
      setConversations((prev) => [toConversation(record), ...prev]);
      setActiveId(record.id);
    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  };

  const ensureActiveConversation = async (titleHint: string): Promise<string> => {
    if (activeId) return activeId;
    const record = await createConversation(titleHint.slice(0, 46));
    loadedMessageIds.current.add(record.id);
    setConversations((prev) => [toConversation(record), ...prev]);
    setActiveId(record.id);
    return record.id;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const fid = await ensureActiveConversation(content);

    const userMsg: Message = {
      id: `local-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === fid
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              updatedAt: new Date(),
              title: c.messages.length === 0 ? content.slice(0, 46) : c.title,
            }
          : c
      )
    );

    setIsTyping(true);

    // Placeholder assistant message we'll fill in as tokens stream in.
    const aiMsgId = `local-${Date.now()}-ai`;
    let placeholderCreated = false;

    const historyForBackend = [
      ...(conversations.find((c) => c.id === fid)?.messages ?? []),
      userMsg,
    ];

    const ensurePlaceholder = () => {
      if (placeholderCreated) return;
      placeholderCreated = true;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === fid
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: aiMsgId, role: "assistant" as const, content: "", timestamp: new Date() },
                ],
              }
            : c
        )
      );
    };

    const appendDelta = (delta: string) => {
      ensurePlaceholder();
      setIsTyping(false);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === fid
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === aiMsgId ? { ...m, content: m.content + delta } : m
                ),
                updatedAt: new Date(),
              }
            : c
        )
      );
    };

    const attachCitations = (citations: Message["citations"]) => {
      if (!citations || citations.length === 0) return;
      ensurePlaceholder();
      setConversations((prev) =>
        prev.map((c) =>
          c.id === fid
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === aiMsgId ? { ...m, citations } : m)),
              }
            : c
        )
      );
    };

    try {
      await streamChat(fid, historyForBackend, {
        onCitations: attachCitations,
        onDelta: appendDelta,
      });
    } catch (err) {
      ensurePlaceholder();
      const errorText = formatErrorReply(err);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === fid
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === aiMsgId ? { ...m, content: errorText } : m
                ),
              }
            : c
        )
      );
    }

    setIsTyping(false);
  };

  const handleUploadFile = async (file: File) => {
    try {
      const fid = await ensureActiveConversation(file.name);
      const result = await uploadDocument(fid, file);
      const note: Message = {
        id: `local-${Date.now()}-upload`,
        role: "assistant",
        content: `📄 Ingested **${result.source}** into this conversation's knowledge base (${result.chunks_added} chunks). Ask me anything about it.`,
        timestamp: new Date(),
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === fid ? { ...c, messages: [...c.messages, note] } : c))
      );
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleDelete = async (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
    try {
      await apiDeleteConversation(id);
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  const filtered = searchQuery
    ? conversations.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        conversations={filtered}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={handleNewChat}
        onDelete={handleDelete}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        darkMode={darkMode}
      />
      <ChatWindow
        conversation={activeConversation}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onUploadFile={handleUploadFile}
        onNewChat={handleNewChat}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        darkMode={darkMode}
        onToggleDark={toggleDark}
      />
      {!loaded && (
        <div
          style={{
            position: "fixed",
            bottom: 12,
            right: 16,
            fontSize: 12,
            color: darkMode ? "#888" : "#999",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Loading conversations…
        </div>
      )}
    </div>
  );
}
