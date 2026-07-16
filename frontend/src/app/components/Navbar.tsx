import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Moon, Sun, Github, Menu, X, MessageSquare } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function Navbar() {
  const { darkMode, toggleDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const bg = darkMode ? "#171717" : "#ffffff";
  const borderColor = darkMode ? "#2d2d2d" : "#e9e9e9";
  const textColor = darkMode ? "#ececec" : "#0d0d0d";
  const mutedColor = darkMode ? "#8e8e8e" : "#6e6e80";
  const hoverBg = darkMode ? "#2a2a2a" : "#f4f4f4";

  const NAV_LINKS = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "Chat" },
    { to: "/about", label: "About" },
  ];

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: bg,
        borderBottom: `1px solid ${borderColor}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#10a37f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 41 41" fill="none">
              <path
                d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.15-3.765 10.079 10.079 0 0 0-11.51 4.985 9.964 9.964 0 0 0-6.675 4.813 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.15 3.765 10.079 10.079 0 0 0 11.51-4.985 9.965 9.965 0 0 0 6.675-4.813 10.079 10.079 0 0 0-1.24-11.817z"
                fill="white"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: textColor,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            AI Chatbot
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive(to) ? 600 : 400,
                color: isActive(to) ? textColor : mutedColor,
                backgroundColor: isActive(to) ? hoverBg : "transparent",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "6px",
              borderRadius: "7px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: mutedColor,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Github size={18} />
          </a>
          <button
            onClick={toggleDark}
            title={darkMode ? "Light mode" : "Dark mode"}
            style={{
              padding: "6px",
              borderRadius: "7px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: mutedColor,
              display: "flex",
              alignItems: "center",
            }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => navigate("/chat")}
            style={{
              padding: "7px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#10a37f",
              cursor: "pointer",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <MessageSquare size={14} />
            Start Chat
          </button>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              padding: "6px",
              borderRadius: "7px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: mutedColor,
              display: "none",
            }}
            className="mobile-menu-btn"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div
          style={{
            borderTop: `1px solid ${borderColor}`,
            padding: "12px 24px",
            backgroundColor: bg,
          }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "10px 0",
                textDecoration: "none",
                fontSize: "15px",
                color: isActive(to) ? "#10a37f" : textColor,
                fontFamily: "Inter, sans-serif",
                fontWeight: isActive(to) ? 600 : 400,
                borderBottom: `1px solid ${borderColor}`,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
