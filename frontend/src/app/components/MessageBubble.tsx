import { useState } from "react";
import { motion } from "motion/react";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, FileText, ChevronDown } from "lucide-react";
import { AIAvatar } from "./TypingIndicator";
import type { Message } from "../types";

export type { Message };

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

interface MessageBubbleProps {
  message: Message;
  darkMode: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderContent(content: string, darkMode: boolean) {
  const codeBlockBg = darkMode ? "#1e1e1e" : "#fafafa";
  const codeHeaderBg = darkMode ? "#2a2a2a" : "#f2f2f2";
  const codeBorder = darkMode ? "#3a3a3a" : "#e0e0e0";
  const codeTextColor = darkMode ? "#d4d4d4" : "#333";
  const codeMetaColor = darkMode ? "#888" : "#888";
  const inlineCodeBg = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const inner = part.slice(3, -3);
      const nl = inner.indexOf("\n");
      const lang = nl >= 0 ? inner.slice(0, nl).trim() : "";
      const code = nl >= 0 ? inner.slice(nl + 1) : inner;
      return (
        <div key={i} style={{ margin: "10px 0", borderRadius: "10px", overflow: "hidden", border: `1px solid ${codeBorder}` }}>
          <div style={{ padding: "7px 14px", backgroundColor: codeHeaderBg, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${codeBorder}` }}>
            <span style={{ fontSize: "12px", color: codeMetaColor, fontFamily: "Inter, sans-serif" }}>
              {lang || "code"}
            </span>
            <button
              onClick={() => copyToClipboard(code)}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: codeMetaColor, fontSize: "11px", fontFamily: "Inter, sans-serif", padding: "2px 6px", borderRadius: "4px" }}
            >
              Copy
            </button>
          </div>
          <pre style={{ margin: 0, padding: "14px", backgroundColor: codeBlockBg, overflowX: "auto", fontSize: "13px", lineHeight: "1.65", color: codeTextColor, fontFamily: "'Fira Code','Consolas',monospace" }}>
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    const html = part
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /`([^`]+)`/g,
        `<code style="background:${inlineCodeBg};padding:2px 5px;border-radius:4px;font-size:0.88em;font-family:'Fira Code',monospace;">$1</code>`
      )
      .replace(/\n/g, "<br/>");

    return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export function MessageBubble({ message, darkMode }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const userBubbleBg = darkMode ? "#2d2d2d" : "#f4f4f4";
  const textColor = darkMode ? "#ececec" : "#0d0d0d";
  const mutedColor = darkMode ? "#666" : "#adadad";
  const iconHoverBg = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  const handleCopy = () => {
    copyToClipboard(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}
      >
        <div style={{ maxWidth: "75%" }}>
          <div style={{ backgroundColor: userBubbleBg, color: textColor, padding: "10px 16px", borderRadius: "18px", fontSize: "15px", lineHeight: "1.6", whiteSpace: "pre-wrap", fontFamily: "Inter, sans-serif" }}>
            {message.content}
          </div>
          <div style={{ textAlign: "right", marginTop: "4px", fontSize: "11px", color: mutedColor, fontFamily: "Inter, sans-serif" }}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "flex-start" }}
    >
      <AIAvatar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: textColor, fontSize: "15px", lineHeight: "1.7", fontFamily: "Inter, sans-serif" }}>
          {renderContent(message.content, darkMode)}
        </div>
        {message.citations && message.citations.length > 0 && (
          <CitationFootnotes citations={message.citations} darkMode={darkMode} />
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "2px", marginTop: "8px" }}>
          <ActionBtn icon={copied ? <Check size={13} /> : <Copy size={13} />} title="Copy" color={mutedColor} hoverBg={iconHoverBg} onClick={handleCopy} />
          <ActionBtn icon={<ThumbsUp size={13} />} title="Good response" color={mutedColor} hoverBg={iconHoverBg} />
          <ActionBtn icon={<ThumbsDown size={13} />} title="Bad response" color={mutedColor} hoverBg={iconHoverBg} />
          <ActionBtn icon={<RotateCcw size={13} />} title="Regenerate" color={mutedColor} hoverBg={iconHoverBg} />
          <span style={{ fontSize: "11px", color: mutedColor, marginLeft: "6px", fontFamily: "Inter, sans-serif" }}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function CitationFootnotes({
  citations,
  darkMode,
}: {
  citations: NonNullable<Message["citations"]>;
  darkMode: boolean;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const chipBg = darkMode ? "#252525" : "#f4f4f4";
  const chipBorder = darkMode ? "#3a3a3a" : "#e0e0e0";
  const textColor = darkMode ? "#ccc" : "#444";
  const mutedColor = darkMode ? "#888" : "#8e8ea0";
  const snippetBg = darkMode ? "#1e1e1e" : "#fafafa";

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {citations.map((c) => {
          const isOpen = expandedIndex === c.index;
          return (
            <button
              key={c.index}
              onClick={() => setExpandedIndex(isOpen ? null : c.index)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 9px",
                borderRadius: "14px",
                border: `1px solid ${chipBorder}`,
                background: chipBg,
                cursor: "pointer",
                color: textColor,
                fontSize: "12px",
                fontFamily: "Inter, sans-serif",
              }}
              title={`View snippet from ${c.source}`}
            >
              <FileText size={11} color={mutedColor} />
              <span>
                [{c.index}] {c.source}
              </span>
              <ChevronDown
                size={11}
                color={mutedColor}
                style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
              />
            </button>
          );
        })}
      </div>
      {citations.map(
        (c) =>
          expandedIndex === c.index && (
            <div
              key={`snippet-${c.index}`}
              style={{
                marginTop: "6px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: `1px solid ${chipBorder}`,
                background: snippetBg,
                fontSize: "12.5px",
                lineHeight: "1.6",
                color: textColor,
                fontFamily: "Inter, sans-serif",
                whiteSpace: "pre-wrap",
              }}
            >
              {c.snippet}
            </div>
          )
      )}
    </div>
  );
}

function ActionBtn({ icon, title, color, hoverBg, onClick }: { icon: React.ReactNode; title: string; color: string; hoverBg: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: "5px", borderRadius: "5px", border: "none", background: hovered ? hoverBg : "transparent", cursor: "pointer", color, display: "flex", alignItems: "center", transition: "background 0.1s" }}
    >
      {icon}
    </button>
  );
}
