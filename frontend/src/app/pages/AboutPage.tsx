import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Github,
  ExternalLink,
  Layers,
  Database,
  Server,
  Globe,
  Cpu,
  ArrowRight,
  BookOpen,
  Code2,
  FlaskConical,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const TECH_STACK = [
  {
    category: "Frontend",
    icon: Globe,
    color: "#3b82f6",
    items: ["Next.js / React", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide React", "React Hook Form"],
  },
  {
    category: "AI Models",
    icon: Cpu,
    color: "#10a37f",
    items: ["Llama 3", "Mistral", "Gemma", "Phi", "DialoGPT", "Custom Fine-Tuned"],
  },
  {
    category: "Backend",
    icon: Server,
    color: "#f59e0b",
    items: ["FastAPI", "PyTorch", "Hugging Face Transformers", "Uvicorn", "Python 3.11+"],
  },
  {
    category: "Database",
    icon: Database,
    color: "#8b5cf6",
    items: ["PostgreSQL", "MongoDB", "Redis (cache)", "SQLite (dev)"],
  },
];

const ARCHITECTURE_STEPS = [
  { label: "User Message", desc: "User types a prompt in the chat interface" },
  { label: "Next.js Frontend", desc: "React processes input and sends to API" },
  { label: "FastAPI Backend", desc: "Validates and routes request to model" },
  { label: "Transformer Model", desc: "Attention mechanism processes tokens" },
  { label: "Generate Response", desc: "Model outputs token probabilities" },
  { label: "Stream to UI", desc: "Response streams back token-by-token" },
];

export function AboutPage() {
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

      {/* ── Header ── */}
      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "80px 24px 64px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
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
            <BookOpen size={13} />
            About This Project
          </div>
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 800,
              color: textColor,
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            AI Chatbot Using
            <br />
            <span style={{ color: accent }}>Transformers</span>
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: mutedColor,
              lineHeight: 1.7,
              margin: "0 0 32px",
            }}
          >
            An open-source conversational AI built to demonstrate the power of
            Transformer-based language models. Designed for learning, research,
            and real-world experimentation.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "8px",
                border: `1px solid ${borderColor}`,
                backgroundColor: "transparent",
                color: textColor,
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <Github size={16} /> View on GitHub
            </a>
            <button
              onClick={() => navigate("/chat")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: accent,
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Try it Now <ArrowRight size={15} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Project Overview ── */}
      <section style={{ backgroundColor: sectionBg, padding: "64px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <SectionLabel label="Overview" accent={accent} />
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: textColor, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            What is this project?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {[
              {
                icon: <Code2 size={20} />,
                title: "Educational Purpose",
                desc: "Demonstrates how modern LLMs work under the hood — tokenization, attention, generation, and fine-tuning.",
              },
              {
                icon: <FlaskConical size={20} />,
                title: "Research Ready",
                desc: "Modular architecture allows swapping models, adjusting temperature, and experimenting with generation params.",
              },
              {
                icon: <Layers size={20} />,
                title: "Full Stack",
                desc: "Complete frontend + backend implementation using industry-standard tools and frameworks.",
              },
            ].map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
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
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: textColor, margin: "0 0 8px" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "13px", color: mutedColor, margin: 0, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Transformer Architecture ── */}
      <section style={{ backgroundColor: bg, padding: "64px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <SectionLabel label="Architecture" accent={accent} />
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: textColor, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            AI Workflow
          </h2>
          <p style={{ fontSize: "15px", color: mutedColor, margin: "0 0 40px", lineHeight: 1.6 }}>
            From user message to streamed response — here's what happens behind the scenes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {ARCHITECTURE_STEPS.map(({ label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: i === 0 || i === ARCHITECTURE_STEPS.length - 1 ? accent : cardBg,
                      border: `2px solid ${accent}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: i === 0 || i === ARCHITECTURE_STEPS.length - 1 ? "white" : accent,
                    }}
                  >
                    {i + 1}
                  </div>
                  {i < ARCHITECTURE_STEPS.length - 1 && (
                    <div
                      style={{
                        width: "2px",
                        height: "40px",
                        backgroundColor: `${accent}40`,
                        margin: "4px 0",
                      }}
                    />
                  )}
                </div>
                <div style={{ paddingBottom: i < ARCHITECTURE_STEPS.length - 1 ? "8px" : "0", paddingTop: "6px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: textColor, marginBottom: "2px" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "13px", color: mutedColor, lineHeight: 1.5 }}>{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section style={{ backgroundColor: sectionBg, padding: "64px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <SectionLabel label="Technology Stack" accent={accent} />
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: textColor, margin: "0 0 36px", letterSpacing: "-0.02em" }}>
            Built with modern tools
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {TECH_STACK.map(({ category, icon: Icon, color, items }, i) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "14px",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      backgroundColor: `${color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: color,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: textColor }}>
                    {category}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {items.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: mutedColor,
                      }}
                    >
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: color,
                          flexShrink: 0,
                        }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Model Information ── */}
      <section style={{ backgroundColor: bg, padding: "64px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <SectionLabel label="AI Models" accent={accent} />
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: textColor, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Supported Models
          </h2>
          <p style={{ fontSize: "15px", color: mutedColor, margin: "0 0 32px", lineHeight: 1.6 }}>
            The chatbot is model-agnostic — swap between different Transformer architectures based on your needs.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
            }}
          >
            {["Llama 3", "Mistral 7B", "Gemma", "Phi-3", "DialoGPT", "GPT-2"].map((model, i) => (
              <motion.div
                key={model}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: `${accent}1a`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: accent,
                    margin: "0 auto 10px",
                  }}
                >
                  <Cpu size={16} />
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: textColor }}>
                  {model}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── License + GitHub ── */}
      <section
        style={{
          backgroundColor: sectionBg,
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p style={{ fontSize: "14px", color: mutedColor, margin: "0 0 20px" }}>
            Released under the <strong style={{ color: textColor }}>MIT License</strong>. Free to use, modify, and distribute.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              borderRadius: "8px",
              border: `1px solid ${borderColor}`,
              backgroundColor: cardBg,
              color: textColor,
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <Github size={16} /> View Source on GitHub <ExternalLink size={13} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionLabel({ label, accent }: { label: string; accent: string }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: accent,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginBottom: "10px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {label}
    </div>
  );
}
