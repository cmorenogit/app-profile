import { useState, useRef, useEffect } from "react";
import { track } from "@vercel/analytics/react";
import { SentimentDemo } from "./SentimentDemo";
import { SummaryDemo } from "./SummaryDemo";
import { ImageDemo } from "./ImageDemo";
import { RAGDemo } from "./RAGDemo";
import { WhisperDemo } from "./WhisperDemo";
import { useDevice } from "./useDevice";
import { useMobileDetect } from "./useMobileDetect";

const demos = [
  {
    id: "sentiment",
    title: "Sentiment Analysis",
    shortTitle: "Sentiment",
    description: "Detects if a text is positive, negative, or neutral",
    icon: "😊",
  },
  {
    id: "summary",
    title: "Text Summary",
    shortTitle: "Summary",
    description: "Condenses a paragraph into a short summary",
    icon: "📝",
  },
  {
    id: "image",
    title: "Image Classification",
    shortTitle: "Image",
    description: "Identifies what's in a photo",
    icon: "🖼️",
  },
  {
    id: "rag",
    title: "RAG Explorer",
    shortTitle: "RAG",
    description: "Semantic search with embeddings and cosine similarity",
    icon: "🔍",
  },
  {
    id: "whisper",
    title: "Speech-to-Text",
    shortTitle: "Speech",
    description: "Transcribe audio from your microphone with Whisper",
    icon: "🎙️",
  },
] as const;

const MODEL_SIZES: Record<string, number> = {
  sentiment: 67,
  summary: 305,
  image: 88,
  rag: 23,
  whisper: 40,
};

type DemoId = (typeof demos)[number]["id"];

export function PlaygroundApp() {
  const [activeDemo, setActiveDemo] = useState<DemoId | null>(null);
  const demoPanelRef = useRef<HTMLDivElement>(null);
  const pillBarRef = useRef<HTMLDivElement>(null);
  const { device, isDetecting, isWebGPU } = useDevice();
  const mobileInfo = useMobileDetect();
  const isMobileView = mobileInfo.isMobile || mobileInfo.isTablet;

  useEffect(() => {
    if (navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }, []);

  // On mobile: scroll to demo content when selected (pill bar stays sticky)
  // On desktop: scroll to demo panel
  useEffect(() => {
    if (activeDemo && demoPanelRef.current) {
      if (isMobileView) {
        // Scroll so the pill bar sits at the top, content below it
        demoPanelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        demoPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [activeDemo, isMobileView]);

  const handleSelectDemo = (demoId: DemoId) => {
    if (activeDemo !== demoId) {
      track("demo_started", { demo: demoId, device: isMobileView ? "mobile" : "desktop" });
    }
    setActiveDemo(activeDemo === demoId ? null : demoId);
  };

  const activeInfo = activeDemo ? demos.find((d) => d.id === activeDemo) : null;

  return (
    <div>
      {/* Device badges */}
      {!isDetecting && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "6px",
            background: isWebGPU ? "rgba(100, 255, 218, 0.08)" : "rgba(136, 146, 176, 0.08)",
            border: `1px solid ${isWebGPU ? "rgba(100, 255, 218, 0.15)" : "rgba(136, 146, 176, 0.12)"}`,
            fontSize: "12px",
            color: isWebGPU ? "#64ffda" : "#8892b0",
            fontFamily: "'Geist Mono', monospace",
          }}>
            {isWebGPU ? "⚡ WebGPU accelerated" : "🔧 Running on WASM (CPU)"}
            {isWebGPU && (
              <span style={{ color: "#8892b0", fontSize: "11px" }}>
                — GPU-powered inference
              </span>
            )}
          </div>
          {mobileInfo.isMobile && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "6px",
              background: "rgba(167, 139, 250, 0.08)",
              border: "1px solid rgba(167, 139, 250, 0.12)",
              fontSize: "12px",
              color: "#a78bfa",
              fontFamily: "'Geist Mono', monospace",
            }}>
              {mobileInfo.recommendation === "full" ? "📱 all demos" : mobileInfo.recommendation === "mobile" ? "📱 optimized for mobile" : "📱 limited demos"}
            </div>
          )}
        </div>
      )}

      {/* ===== MOBILE: Sticky pill bar ===== */}
      {isMobileView ? (
        <>
          {/* Pill bar — sticky when scrolling */}
          <div
            ref={pillBarRef}
            style={{
              position: "sticky",
              top: 0,
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 4px",
              background: "rgba(10, 25, 47, 0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: activeDemo ? "1px solid rgba(100, 255, 218, 0.1)" : "1px solid transparent",
              marginLeft: "-24px",
              marginRight: "-24px",
              paddingLeft: "24px",
              paddingRight: "24px",
              overflowX: "auto",
              overflowY: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              transition: "border-color 0.3s ease",
            }}
          >
            <style>{`
              .pill-bar::-webkit-scrollbar { display: none; }
            `}</style>
            {demos.map((demo) => {
              const isActive = activeDemo === demo.id;
              return (
                <button
                  key={demo.id}
                  onClick={() => handleSelectDemo(demo.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: isActive ? "6px 14px" : "6px 10px",
                    borderRadius: "9999px",
                    border: isActive
                      ? "1px solid rgba(100, 255, 218, 0.4)"
                      : "1px solid rgba(136, 146, 176, 0.2)",
                    background: isActive
                      ? "rgba(100, 255, 218, 0.12)"
                      : "rgba(17, 34, 64, 0.6)",
                    color: isActive ? "#64ffda" : "#8892b0",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    minHeight: "36px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{demo.icon}</span>
                  {isActive && <span>{demo.shortTitle}</span>}
                </button>
              );
            })}
          </div>

          {/* No demo selected — show browse cards */}
          {!activeDemo && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
              {demos.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => handleSelectDemo(demo.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    borderRadius: "10px",
                    border: "1px solid rgba(100, 255, 218, 0.08)",
                    background: "rgba(17, 34, 64, 0.5)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.2s ease, background 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: "24px", flexShrink: 0 }}>{demo.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#e6f1ff", fontSize: "14px", fontWeight: 600 }}>
                        {demo.title}
                      </span>
                      <span style={{
                        padding: "1px 6px",
                        borderRadius: "4px",
                        background: "rgba(136, 146, 176, 0.08)",
                        border: "1px solid rgba(136, 146, 176, 0.1)",
                        fontSize: "10px",
                        color: "#8892b0",
                        fontFamily: "'Geist Mono', monospace",
                        flexShrink: 0,
                      }}>
                        {MODEL_SIZES[demo.id]}MB
                      </span>
                    </div>
                    <p style={{ color: "#8892b0", fontSize: "12px", lineHeight: 1.4, margin: "2px 0 0 0" }}>
                      {demo.description}
                    </p>
                  </div>
                  <span style={{ color: "#64ffda", fontSize: "16px", flexShrink: 0 }}>›</span>
                </button>
              ))}
            </div>
          )}

          {/* Active demo content */}
          {activeDemo && (
            <div
              ref={demoPanelRef}
              style={{
                marginTop: "16px",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(100, 255, 218, 0.1)",
                background: "rgba(17, 34, 64, 0.4)",
              }}
            >
              {activeDemo === "sentiment" && <SentimentDemo />}
              {activeDemo === "summary" && <SummaryDemo />}
              {activeDemo === "image" && <ImageDemo />}
              {activeDemo === "rag" && <RAGDemo />}
              {activeDemo === "whisper" && <WhisperDemo />}
            </div>
          )}
        </>
      ) : (
        /* ===== DESKTOP: Original card grid ===== */
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: "16px" }}>
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => handleSelectDemo(demo.id)}
                style={{
                  padding: "24px 20px",
                  borderRadius: "12px",
                  border: `1px solid ${activeDemo === demo.id ? "rgba(100, 255, 218, 0.3)" : "rgba(100, 255, 218, 0.08)"}`,
                  background: activeDemo === demo.id ? "rgba(100, 255, 218, 0.08)" : "rgba(17, 34, 64, 0.5)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.3s ease, background 0.3s ease, transform 0.2s ease",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (activeDemo !== demo.id) {
                    e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.15)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeDemo !== demo.id) {
                    e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{demo.icon}</div>
                <h3 style={{ color: activeDemo === demo.id ? "#64ffda" : "#e6f1ff", fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>
                  {demo.title}
                </h3>
                <p style={{ color: "#8892b0", fontSize: "13px", lineHeight: 1.5, margin: 0 }}>
                  {demo.description}
                </p>
                <span style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  background: "rgba(136, 146, 176, 0.08)",
                  border: "1px solid rgba(136, 146, 176, 0.1)",
                  fontSize: "11px",
                  color: "#8892b0",
                  fontFamily: "'Geist Mono', monospace",
                  marginTop: "10px",
                }}>
                  ~{MODEL_SIZES[demo.id]} MB
                </span>
              </button>
            ))}
          </div>

          {activeDemo && (
            <div
              ref={demoPanelRef}
              style={{
                marginTop: "24px",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid rgba(100, 255, 218, 0.1)",
                background: "rgba(17, 34, 64, 0.4)",
              }}
            >
              {activeDemo === "sentiment" && <SentimentDemo />}
              {activeDemo === "summary" && <SummaryDemo />}
              {activeDemo === "image" && <ImageDemo />}
              {activeDemo === "rag" && <RAGDemo />}
              {activeDemo === "whisper" && <WhisperDemo />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
