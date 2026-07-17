import { useState, useRef, KeyboardEvent } from "react";
import { Plus, Mic, ArrowUp, Paperclip, BarChart2 } from "lucide-react";

interface InputAreaProps {
  onSendMessage: (content: string) => void;
  onUploadFile?: (file: File) => void;
  darkMode: boolean;
  large?: boolean;
}

export function InputArea({ onSendMessage, onUploadFile, darkMode, large }: InputAreaProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadFile) {
      onUploadFile(file);
    }
    e.target.value = ""; // allow re-uploading the same file later
  };

  const bg = darkMode ? "#2a2a2a" : "#f4f4f4";
  const textColor = darkMode ? "#ececec" : "#0d0d0d";
  const placeholderColor = darkMode ? "#666" : "#999";
  const mutedColor = darkMode ? "#888" : "#8e8ea0";
  const hasText = input.trim().length > 0;
  const sendBg = hasText ? "#0d0d0d" : darkMode ? "#3a3a3a" : "#d1d1d1";
  const sendColor = hasText ? "#ffffff" : darkMode ? "#666" : "#999";

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 180) + "px";
    }
  };

  return (
    <div
      style={{
        backgroundColor: bg,
        borderRadius: "16px",
        padding: large ? "12px 14px 10px" : "10px 12px 8px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Ask anything..."
        rows={1}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          color: textColor,
          fontSize: large ? "16px" : "15px",
          resize: "none",
          lineHeight: "1.6",
          padding: "2px 0",
          fontFamily: "Inter, sans-serif",
          maxHeight: "180px",
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      />
      {/* Placeholder style override via inline style isn't possible; we rely on browser default */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "2px" }}>
          <IconButton
            icon={<Plus size={18} />}
            color={mutedColor}
            title="Attach or more options"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <IconButton
            icon={<Paperclip size={16} />}
            color={mutedColor}
            title="Attach file (PDF, TXT, MD, DOCX) — adds it to the RAG knowledge base"
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <IconButton
            icon={<Mic size={16} />}
            color={mutedColor}
            title="Voice input"
          />
          <button
            onClick={handleSend}
            disabled={!hasText}
            title="Send"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: "none",
              background: sendBg,
              cursor: hasText ? "pointer" : "default",
              color: sendColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.15s",
              flexShrink: 0,
            }}
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  icon,
  color,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  color: string;
  title?: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "6px",
        borderRadius: "7px",
        border: "none",
        background: hovered ? "rgba(0,0,0,0.06)" : "transparent",
        cursor: "pointer",
        color: color,
        display: "flex",
        alignItems: "center",
        transition: "background 0.1s",
      }}
    >
      {icon}
    </button>
  );
}
