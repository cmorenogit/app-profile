import { useState, useRef, useEffect } from "react";
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
    description: "Detects if a text is positive, negative, or neutral",
    icon: "😊",
  },
  {
    id: "summary",
    title: "Text Summary",
    description: "Condenses a paragraph into a short summary",
    icon: "📝",
  },
  {
    id: "image",
    title: "Image Classification",
    description: "Identifies what's in a photo",
    icon: "🖼️",
  },
  {
    id: "rag",
    title: "RAG Explorer",
    description: "Semantic search with embeddings and cosine similarity",
    icon: "🔍",
  },
  {
    id: "whisper",
    title: "Speech-to-Text",
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
  const { device, isDetecting, isWebGPU } = useDevice();
  const mobileInfo = useMobileDetect();

  useEffect(() => {
    if (navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (activeDemo && demoPanelRef.current) {
      demoPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeDemo]);

  return (
    <div>
      {/* Device badge */}
      {!isDetecting && (
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
          marginBottom: "20px",
        }}>
          {isWebGPU ? "⚡ WebGPU accelerated" : "🔧 Running on WASM (CPU)"}
          {isWebGPU && (
            <span style={{ color: "#8892b0", fontSize: "11px" }}>
              — GPU-powered inference
            </span>
          )}
        </div>
      )}
      {!isDetecting && mobileInfo.isMobile && (
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
          marginBottom: "20px",
          marginLeft: "8px",
        }}>
          📱 {mobileInfo.deviceMemoryGB}GB estimated — {mobileInfo.recommendation === "full" ? "all demos available" : mobileInfo.recommendation === "mobile" ? "optimized models for mobile" : "limited demos available"}
        </div>
      )}

      {/* Demo selector grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        {demos.map((demo) => (
          <button
            key={demo.id}
            onClick={() => setActiveDemo(activeDemo === demo.id ? null : demo.id)}
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
              marginTop: "8px",
            }}>
              ~{MODEL_SIZES[demo.id]} MB
            </span>
          </button>
        ))}
      </div>

      {/* Active demo panel */}
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
    </div>
  );
}
