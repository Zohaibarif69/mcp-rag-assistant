import { useRef, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Sparkles,
  Moon,
  Sun,
  Share2,
  Menu,
  MoreHorizontal,
} from "lucide-react";
import type { Conversation } from "../types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { InputArea } from "./InputArea";
import { WelcomeScreen } from "./WelcomeScreen";

interface ChatWindowProps {
  conversation: Conversation | null;
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  onUploadFile?: (file: File) => void;
  onNewChat: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  darkMode: boolean;
  onToggleDark: () => void;
}

export function ChatWindow({
  conversation,
  isTyping,
  onSendMessage,
  onUploadFile,
  onToggleSidebar,
  sidebarOpen,
  darkMode,
  onToggleDark,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bg = darkMode ? "#212121" : "#ffffff";
  const textColor = darkMode ? "#ececec" : "#0d0d0d";
  const mutedColor = darkMode ? "#8e8e8e" : "#6e6e80";
  const borderColor = darkMode ? "#2d2d2d" : "#e9e9e9";

  const messages = conversation?.messages ?? [];
  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: bg,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          height: "56px",
          flexShrink: 0,
          borderBottom: hasMessages ? `1px solid ${borderColor}` : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {!sidebarOpen && (
            <TopBarBtn
              icon={<Menu size={18} />}
              color={mutedColor}
              onClick={onToggleSidebar}
              title="Open sidebar"
            />
          )}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "5px 8px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: textColor,
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              ChatGPT
            </span>
            <ChevronDown size={14} color={mutedColor} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <TopBarBtn
            icon={darkMode ? <Sun size={16} /> : <Moon size={16} />}
            color={mutedColor}
            onClick={onToggleDark}
            title={darkMode ? "Light mode" : "Dark mode"}
          />
          {hasMessages && (
            <TopBarBtn
              icon={<Share2 size={16} />}
              color={mutedColor}
              title="Share"
            />
          )}
          <TopBarBtn
            icon={<MoreHorizontal size={16} />}
            color={mutedColor}
            title="More options"
          />
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid transparent",
              background: "transparent",
              cursor: "pointer",
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <Sparkles size={14} />
            Upgrade
          </button>
        </div>
      </div>

      {/* Messages or welcome */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {!hasMessages ? (
          <WelcomeScreen onSendMessage={onSendMessage} onUploadFile={onUploadFile} darkMode={darkMode} />
        ) : (
          <div
            style={{
              maxWidth: "768px",
              margin: "0 auto",
              padding: "24px 20px 8px",
            }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} darkMode={darkMode} />
              ))}
            </AnimatePresence>
            {isTyping && <TypingIndicator darkMode={darkMode} />}
            <div ref={messagesEndRef} style={{ height: "12px" }} />
          </div>
        )}
      </div>

      {/* Input when chatting */}
      {hasMessages && (
        <div
          style={{
            padding: "10px 20px 18px",
            flexShrink: 0,
          }}
        >
          <div style={{ maxWidth: "768px", margin: "0 auto" }}>
            <InputArea onSendMessage={onSendMessage} onUploadFile={onUploadFile} darkMode={darkMode} />
            <p
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: mutedColor,
                marginTop: "8px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function TopBarBtn({
  icon,
  color,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: "6px",
        borderRadius: "7px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: color,
        display: "flex",
        alignItems: "center",
      }}
    >
      {icon}
    </button>
  );
}
