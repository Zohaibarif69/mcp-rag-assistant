import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  MessageSquare,
  Brain,
  Zap,
  History,
  Moon,
  Smartphone,
  ArrowRight,
  Keyboard,
  Cpu,
  Sparkles,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Real-Time AI Chat",
    desc: "Seamless conversations with instant responses powered by state-of-the-art Transformer models.",
  },
  {
    icon: Brain,
    title: "Context-Aware Conversations",
    desc: "The AI maintains full conversation context, providing coherent and relevant answers throughout.",
  },
  {
    icon: Zap,
    title: "Fast Response Generation",
    desc: "Optimized inference pipeline delivers intelligent replies in milliseconds.",
  },
  {
    icon: History,
    title: "Chat History",
    desc: "All conversations saved locally — revisit, search, and continue past discussions anytime.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    desc: "Comfortable viewing in any lighting with a carefully designed dark theme toggle.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    desc: "Fully responsive design that works beautifully across phones, tablets, and desktops.",
  },
];

const STEPS = [
  {
    icon: Keyboard,
    num: "01",
    title: "Type Your Question",
    desc: "Enter any question or prompt in the chat input area and press Enter.",
  },
  {
    icon: Cpu,
    num: "02",
    title: "AI Processes the Request",
    desc: "The Transformer model tokenizes and processes your input using attention mechanisms.",
  },
  {
    icon: Sparkles,
    num: "03",
    title: "Response Generated",
    desc: "The model generates an intelligent, contextual response based on your conversation.",
  },
  {
    icon: RefreshCcw,
    num: "04",
    title: "Conversation Continues",
    desc: "Keep chatting — the AI remembers the full history for coherent multi-turn dialogue.",
  },
];

export function LandingPage() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const bg = darkMode ? "#212121" : "#ffffff";
  const sectionBg = darkMode ? "#171717" : "#f7f7f8";
  const cardBg = darkMode ? "#2a2a2a" : "#ffffff";
  const textColor = darkMode ? "#ececec" : "#0d0d0d";
  const mutedColor = darkMode ? "#8e8e8e" : "#6e6e80";
  const borderColor = darkMode ? "#2d2d2d" : "#e5e5e5";
  const accent = "#10a37f";

  return (
    <div
      style={{
        backgroundColor: bg,
        color: textColor,
        minHeight: "100vh",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      <Navbar />

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "96px 24px 80px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "22px",
            backgroundColor: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
            boxShadow: "0 8px 32px rgba(16,163,127,0.3)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 41 41" fill="none">
            <path
              d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.15-3.765 10.079 10.079 0 0 0-11.51 4.985 9.964 9.964 0 0 0-6.675 4.813 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.15 3.765 10.079 10.079 0 0 0 11.51-4.985 9.965 9.965 0 0 0 6.675-4.813 10.079 10.079 0 0 0-1.24-11.817z"
              fill="white"
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 14px",
            borderRadius: "20px",
            border: `1px solid ${accent}40`,
            backgroundColor: `${accent}12`,
            color: accent,
            fontSize: "12px",
            fontWeight: 600,
            marginBottom: "20px",
            letterSpacing: "0.04em",
          }}
        >
          <CheckCircle2 size={13} />
          Powered by Transformer Models
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: "clamp(36px, 6vw, 56px)",
            fontWeight: 800,
            color: textColor,
            margin: "0 0 20px",
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
          }}
        >
          AI Chatbot Using
          <br />
          <span style={{ color: accent }}>Transformers</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "18px",
            color: mutedColor,
            margin: "0 auto 44px",
            lineHeight: 1.65,
            maxWidth: "520px",
          }}
        >
          Ask questions, get intelligent answers, and experience real-time AI
          conversations powered by deep learning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/chat")}
            style={{
              padding: "13px 28px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: accent,
              color: "white",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(16,163,127,0.35)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Start Chat <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate("/about")}
            style={{
              padding: "13px 28px",
              borderRadius: "10px",
              border: `1px solid ${borderColor}`,
              backgroundColor: "transparent",
              color: textColor,
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Learn More
          </button>
        </motion.div>

        {/* Mini chat preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            marginTop: "64px",
            borderRadius: "16px",
            border: `1px solid ${borderColor}`,
            backgroundColor: cardBg,
            padding: "24px",
            textAlign: "left",
            boxShadow: darkMode
              ? "0 8px 40px rgba(0,0,0,0.4)"
              : "0 8px 40px rgba(0,0,0,0.08)",
            maxWidth: "600px",
            margin: "64px auto 0",
          }}
        >
          <PreviewMessage
            role="user"
            text="Explain how Transformer models work"
            darkMode={darkMode}
          />
          <PreviewMessage
            role="ai"
            text="Transformer models use a self-attention mechanism that allows them to weigh the relevance of each word in context. Unlike RNNs, they process all tokens in parallel, making them significantly faster and better at capturing long-range dependencies..."
            darkMode={darkMode}
          />
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section style={{ backgroundColor: sectionBg, padding: "80px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionHeader
            title="Everything you need"
            sub="Packed with features to make your AI conversations smarter and more productive"
            textColor={textColor}
            mutedColor={mutedColor}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <FeatureCard
                key={title}
                icon={<Icon size={20} />}
                title={title}
                desc={desc}
                cardBg={cardBg}
                border={borderColor}
                textColor={textColor}
                mutedColor={mutedColor}
                accent={accent}
                delay={i * 0.07}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ backgroundColor: bg, padding: "80px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <SectionHeader
            title="How it works"
            sub="From your question to an intelligent answer in four steps"
            textColor={textColor}
            mutedColor={mutedColor}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "16px",
            }}
          >
            {STEPS.map(({ icon: Icon, num, title, desc }, i) => (
              <StepCard
                key={num}
                icon={<Icon size={20} />}
                num={num}
                title={title}
                desc={desc}
                border={borderColor}
                cardBg={cardBg}
                textColor={textColor}
                mutedColor={mutedColor}
                accent={accent}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section
        style={{
          backgroundColor: accent,
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "white",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Ready to start chatting?
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 32px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Jump right in — no sign-up required.
          </p>
          <button
            onClick={() => navigate("/chat")}
            style={{
              padding: "13px 32px",
              borderRadius: "10px",
              border: "2px solid rgba(255,255,255,0.6)",
              backgroundColor: "white",
              color: accent,
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Open Chat →
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

/* ─── Sub-components ─── */

function SectionHeader({
  title,
  sub,
  textColor,
  mutedColor,
}: {
  title: string;
  sub: string;
  textColor: string;
  mutedColor: string;
}) {
  return (
    <div style={{ textAlign: "center", marginBottom: "52px" }}>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: "32px",
          fontWeight: 700,
          color: textColor,
          margin: "0 0 10px",
          letterSpacing: "-0.02em",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          fontSize: "16px",
          color: mutedColor,
          margin: 0,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {sub}
      </motion.p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  cardBg,
  border,
  textColor,
  mutedColor,
  accent,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  cardBg: string;
  border: string;
  textColor: string;
  mutedColor: string;
  accent: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${border}`,
        borderRadius: "14px",
        padding: "24px",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 28px rgba(0,0,0,0.1)" : "none",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          backgroundColor: `${accent}1a`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
          marginBottom: "14px",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: textColor,
          margin: "0 0 8px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "13px",
          color: mutedColor,
          margin: 0,
          lineHeight: 1.65,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {desc}
      </p>
    </motion.div>
  );
}

function StepCard({
  icon,
  num,
  title,
  desc,
  border,
  cardBg,
  textColor,
  mutedColor,
  accent,
  delay,
}: {
  icon: React.ReactNode;
  num: string;
  title: string;
  desc: string;
  border: string;
  cardBg: string;
  textColor: string;
  mutedColor: string;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${border}`,
        borderRadius: "14px",
        padding: "24px",
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: accent,
          letterSpacing: "0.08em",
          marginBottom: "12px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        STEP {num}
      </div>
      <div
        style={{
          color: accent,
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          color: textColor,
          margin: "0 0 8px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "13px",
          color: mutedColor,
          margin: 0,
          lineHeight: 1.65,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {desc}
      </p>
    </motion.div>
  );
}

function PreviewMessage({
  role,
  text,
  darkMode,
}: {
  role: "user" | "ai";
  text: string;
  darkMode: boolean;
}) {
  const textColor = darkMode ? "#ececec" : "#0d0d0d";
  const mutedColor = darkMode ? "#8e8e8e" : "#6e6e80";
  const bubbleBg = darkMode ? "#363636" : "#f4f4f4";

  if (role === "user") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: bubbleBg,
            color: textColor,
            padding: "10px 14px",
            borderRadius: "16px",
            fontSize: "14px",
            lineHeight: 1.5,
            maxWidth: "80%",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {text}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
      <div
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          backgroundColor: "#10a37f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 41 41" fill="none">
          <path
            d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.15-3.765 10.079 10.079 0 0 0-11.51 4.985 9.964 9.964 0 0 0-6.675 4.813 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.15 3.765 10.079 10.079 0 0 0 11.51-4.985 9.965 9.965 0 0 0 6.675-4.813 10.079 10.079 0 0 0-1.24-11.817z"
            fill="white"
          />
        </svg>
      </div>
      <div
        style={{
          color: textColor,
          fontSize: "14px",
          lineHeight: 1.65,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {text}
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "14px",
            backgroundColor: "#10a37f",
            marginLeft: "2px",
            verticalAlign: "middle",
            animation: "blink 1s step-end infinite",
          }}
        />
      </div>
    </div>
  );
}
