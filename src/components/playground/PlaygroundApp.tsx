import { useState, useRef, useEffect } from "react";
import { SentimentDemo } from "./SentimentDemo";
import { SummaryDemo } from "./SummaryDemo";
import { ImageDemo } from "./ImageDemo";

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
] as const;

type DemoId = (typeof demos)[number]["id"];

export function PlaygroundApp() {
  const [activeDemo, setActiveDemo] = useState<DemoId | null>(null);
  const demoPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeDemo && demoPanelRef.current) {
      demoPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeDemo]);

  return (
    <div>
      {/* Demo selector grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
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
              transform: activeDemo === demo.id ? "scale(1)" : "scale(1)",
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
        </div>
      )}
    </div>
  );
}
