import { Link } from "react-router";
import { Github, Twitter } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Chat", to: "/chat" },
  { label: "About", to: "/about" },
  { label: "Documentation", to: "/about" },
  { label: "Privacy Policy", to: "/" },
];

export function Footer() {
  const { darkMode } = useTheme();

  const bg = darkMode ? "#171717" : "#f7f7f8";
  const borderColor = darkMode ? "#2d2d2d" : "#e5e5e5";
  const textColor = darkMode ? "#ececec" : "#0d0d0d";
  const mutedColor = darkMode ? "#8e8e8e" : "#6e6e80";

  return (
    <footer
      style={{
        backgroundColor: bg,
        borderTop: `1px solid ${borderColor}`,
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: "280px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "7px",
                  backgroundColor: "#10a37f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 41 41" fill="none">
                  <path
                    d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.15-3.765 10.079 10.079 0 0 0-11.51 4.985 9.964 9.964 0 0 0-6.675 4.813 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.15 3.765 10.079 10.079 0 0 0 11.51-4.985 9.965 9.965 0 0 0 6.675-4.813 10.079 10.079 0 0 0-1.24-11.817z"
                    fill="white"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: textColor,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                AI Chatbot
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: mutedColor,
                lineHeight: 1.6,
                margin: 0,
                fontFamily: "Inter, sans-serif",
              }}
            >
              An open-source conversational AI powered by Transformer models.
              Built for learning and exploration.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: textColor,
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Navigate
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {LINKS.slice(0, 3).map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    style={{
                      fontSize: "13px",
                      color: mutedColor,
                      textDecoration: "none",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: textColor,
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Resources
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {LINKS.slice(3).map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    style={{
                      fontSize: "13px",
                      color: mutedColor,
                      textDecoration: "none",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {label}
                  </Link>
                ))}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "13px",
                    color: mutedColor,
                    textDecoration: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: `1px solid ${borderColor}`,
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: mutedColor,
              fontFamily: "Inter, sans-serif",
            }}
          >
            © 2026 AI Chatbot Using Transformers. Open source project.
          </span>
          <div style={{ display: "flex", gap: "12px" }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: mutedColor }}
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
