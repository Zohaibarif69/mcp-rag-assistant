import { useState } from "react";
import { motion } from "motion/react";
import {
  Plus,
  BookOpen,
  FolderOpen,
  Grid3x3,
  Code2,
  MoreHorizontal,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Edit2,
} from "lucide-react";
import type { Conversation } from "../types";

export type { Conversation };

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  darkMode: boolean;
}

const NAV_ITEMS = [
  { icon: BookOpen, label: "Library" },
  { icon: FolderOpen, label: "Projects" },
  { icon: Grid3x3, label: "Apps" },
  { icon: Code2, label: "Codex" },
  { icon: MoreHorizontal, label: "More" },
];

export function Sidebar({
  open,
  onToggle,
  conversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  searchQuery,
  onSearchChange,
  darkMode,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const bg = darkMode ? "#171717" : "#f9f9f9";
  const hoverBg = darkMode ? "#2a2a2a" : "#efefef";
  const activeBg = darkMode ? "#2d2d2d" : "#e8e8e8";
  const textColor = darkMode ? "#ececec" : "#0d0d0d";
  const mutedColor = darkMode ? "#8e8e8e" : "#6e6e80";
  const borderColor = darkMode ? "#2a2a2a" : "#e5e5e5";

  if (!open) {
    return (
      <div
        style={{
          width: "60px",
          minWidth: "60px",
          borderRight: `1px solid ${borderColor}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 8px",
          gap: "4px",
          backgroundColor: bg,
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={onToggle}
          title="Open sidebar"
          style={iconBtnStyle(mutedColor)}
        >
          <PanelLeft size={18} />
        </button>
        <button
          onClick={onNewChat}
          title="New chat"
          style={iconBtnStyle(mutedColor)}
        >
          <Edit2 size={17} />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: 260, opacity: 1 }}
      style={{
        width: "260px",
        minWidth: "260px",
        borderRight: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: "column",
        backgroundColor: bg,
        height: "100vh",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Logo row */}
      <div
        style={{
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <OpenAILogo size={32} />
        <button onClick={onToggle} title="Close sidebar" style={iconBtnStyle(mutedColor)}>
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* New chat */}
      <div style={{ padding: "4px 8px", flexShrink: 0 }}>
        <SidebarBtn
          icon={<Plus size={16} />}
          label="New chat"
          onClick={onNewChat}
          hoverBg={hoverBg}
          textColor={textColor}
        />
      </div>

      {/* Nav items */}
      <div style={{ padding: "0 8px 8px", display: "flex", flexDirection: "column", gap: "1px", flexShrink: 0 }}>
        {NAV_ITEMS.map(({ icon: Icon, label }) => (
          <SidebarBtn
            key={label}
            icon={<Icon size={16} />}
            label={label}
            onClick={() => {}}
            hoverBg={hoverBg}
            textColor={textColor}
          />
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: "0 12px 8px", flexShrink: 0 }}>
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search chats..."
          style={{
            width: "100%",
            padding: "7px 10px",
            borderRadius: "8px",
            border: `1px solid ${borderColor}`,
            background: darkMode ? "#252525" : "#fff",
            color: textColor,
            fontSize: "13px",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "Inter, sans-serif",
          }}
        />
      </div>

      {/* Recents */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 8px", minHeight: 0 }}>
        <div
          style={{
            padding: "4px 10px 6px",
            fontSize: "11px",
            fontWeight: 700,
            color: mutedColor,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Recents
        </div>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            style={{ position: "relative" }}
            onMouseEnter={() => setHoveredId(conv.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button
              onClick={() => onSelect(conv.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "7px 10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  activeId === conv.id
                    ? activeBg
                    : hoveredId === conv.id
                    ? hoverBg
                    : "transparent",
                color: textColor,
                transition: "background-color 0.1s",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  paddingRight: hoveredId === conv.id ? "32px" : "0",
                  lineHeight: "1.4",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {conv.title}
              </div>
            </button>
            {hoveredId === conv.id && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                title="Delete"
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "4px",
                  borderRadius: "5px",
                  border: "none",
                  background: hoverBg,
                  cursor: "pointer",
                  color: mutedColor,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* User profile */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#e06b3c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: 700,
            flexShrink: 0,
            letterSpacing: "0.04em",
          }}
        >
          KH
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: textColor, fontFamily: "Inter, sans-serif" }}>
            khananau haan
          </div>
          <div style={{ fontSize: "11px", color: mutedColor, fontFamily: "Inter, sans-serif" }}>Free</div>
        </div>
        <button
          style={{
            padding: "5px 12px",
            borderRadius: "16px",
            border: `1px solid ${borderColor}`,
            background: "transparent",
            cursor: "pointer",
            color: textColor,
            fontSize: "12px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            flexShrink: 0,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Upgrade
        </button>
      </div>
    </motion.div>
  );
}

function iconBtnStyle(color: string): React.CSSProperties {
  return {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color,
    display: "flex",
    alignItems: "center",
  };
}

function SidebarBtn({
  icon,
  label,
  onClick,
  hoverBg,
  textColor,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  hoverBg: string;
  textColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 10px",
        borderRadius: "8px",
        border: "none",
        background: hovered ? hoverBg : "transparent",
        cursor: "pointer",
        color: textColor,
        width: "100%",
        textAlign: "left",
        transition: "background-color 0.1s",
      }}
    >
      {icon}
      <span style={{ fontSize: "14px", fontFamily: "Inter, sans-serif" }}>{label}</span>
    </button>
  );
}

function OpenAILogo({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "8px",
        backgroundColor: "#10a37f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 41 41" fill="none">
        <path
          d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.15-3.765 10.079 10.079 0 0 0-11.51 4.985 9.964 9.964 0 0 0-6.675 4.813 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.15 3.765 10.079 10.079 0 0 0 11.51-4.985 9.965 9.965 0 0 0 6.675-4.813 10.079 10.079 0 0 0-1.24-11.817z"
          fill="white"
        />
      </svg>
    </div>
  );
}
