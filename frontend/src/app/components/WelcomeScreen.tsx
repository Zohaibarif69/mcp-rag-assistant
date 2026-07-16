import { useState } from "react";
import { motion } from "motion/react";
import { ImageIcon, PenLine, Globe } from "lucide-react";
import { InputArea } from "./InputArea";

const SUGGESTIONS = [
  { icon: ImageIcon, label: "Create an image" },
  { icon: PenLine, label: "Write or edit" },
  { icon: Globe, label: "Look something up" },
];

interface WelcomeScreenProps {
  onSendMessage: (content: string) => void;
  onUploadFile?: (file: File) => void;
  darkMode: boolean;
}

export function WelcomeScreen({ onSendMessage, onUploadFile, darkMode }: WelcomeScreenProps) {
  const textColor = darkMode ? "#ececec" : "#0d0d0d";
  const mutedColor = darkMode ? "#888" : "#6e6e80";
  const pillBg = darkMode ? "#252525" : "transparent";
  const pillBorder = darkMode ? "#3a3a3a" : "#d9d9e3";
  const pillHover = darkMode ? "#2d2d2d" : "#f0f0f0";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "0 20px",
        gap: "28px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ textAlign: "center" }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: textColor,
            margin: 0,
            letterSpacing: "-0.01em",
            fontFamily: "Inter, sans-serif",
          }}
        >
          What's on your mind today?
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: "672px" }}
      >
        <InputArea onSendMessage={onSendMessage} onUploadFile={onUploadFile} darkMode={darkMode} large />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {SUGGESTIONS.map(({ icon: Icon, label }) => (
          <SuggestionPill
            key={label}
            icon={<Icon size={14} />}
            label={label}
            bg={pillBg}
            border={pillBorder}
            hoverBg={pillHover}
            textColor={textColor}
            onClick={() => onSendMessage(label)}
          />
        ))}
      </motion.div>
    </div>
  );
}

function SuggestionPill({
  icon,
  label,
  bg,
  border,
  hoverBg,
  textColor,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  bg: string;
  border: string;
  hoverBg: string;
  textColor: string;
  onClick: () => void;
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
        gap: "6px",
        padding: "8px 16px",
        borderRadius: "20px",
        border: `1px solid ${border}`,
        background: hovered ? hoverBg : bg,
        cursor: "pointer",
        color: textColor,
        fontSize: "13px",
        fontFamily: "Inter, sans-serif",
        transition: "background-color 0.15s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
