import { motion } from "motion/react";

interface TypingIndicatorProps {
  darkMode: boolean;
}

const AI_LOGO_PATH =
  "M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.15-3.765 10.079 10.079 0 0 0-11.51 4.985 9.964 9.964 0 0 0-6.675 4.813 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.15 3.765 10.079 10.079 0 0 0 11.51-4.985 9.965 9.965 0 0 0 6.675-4.813 10.079 10.079 0 0 0-1.24-11.817z";

export function TypingIndicator({ darkMode }: TypingIndicatorProps) {
  const mutedColor = darkMode ? "#666" : "#9a9a9a";
  const dotBg = darkMode ? "#555" : "#c0c0c0";

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px",
        alignItems: "flex-start",
      }}
    >
      <AIAvatar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          paddingTop: "4px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: dotBg,
            }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.05, 0.85] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.22,
              ease: "easeInOut",
            }}
          />
        ))}
        <span
          style={{
            fontSize: "13px",
            color: mutedColor,
            marginLeft: "6px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          AI is thinking...
        </span>
      </div>
    </div>
  );
}

export function AIAvatar() {
  return (
    <div
      style={{
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: "#10a37f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: "2px",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 41 41" fill="none">
        <path d={AI_LOGO_PATH} fill="white" />
      </svg>
    </div>
  );
}
