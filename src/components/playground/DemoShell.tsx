import { type ReactNode } from "react";

interface DemoShellProps {
  title: string;
  howItWorks: string;
  modelName: string;
  children: ReactNode;
  isLoading: boolean;
  loadingText?: string;
}

export function DemoShell({ title, howItWorks, modelName, children, isLoading, loadingText }: DemoShellProps) {
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ color: "#e6f1ff", fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
          {title}
        </h3>
        <p style={{ color: "#8892b0", fontSize: "13px", lineHeight: 1.5, margin: "0 0 8px 0" }}>
          <strong style={{ color: "#a8b2d1" }}>How it works:</strong> {howItWorks}
        </p>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "3px 10px",
          borderRadius: "6px",
          background: "rgba(167, 139, 250, 0.1)",
          border: "1px solid rgba(167, 139, 250, 0.15)",
          fontSize: "11px",
          color: "#a78bfa",
          fontFamily: "'Geist Mono', monospace",
        }}>
          Model: {modelName}
        </span>
      </div>

      {isLoading && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          borderRadius: "8px",
          background: "rgba(100, 255, 218, 0.03)",
          border: "1px solid rgba(100, 255, 218, 0.08)",
          marginBottom: "16px",
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            border: "2px solid rgba(100, 255, 218, 0.15)",
            borderTop: "2px solid #64ffda",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ color: "#a8b2d1", fontSize: "13px" }}>
            {loadingText || "Loading model... (first time takes ~10s)"}
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {children}
    </div>
  );
}
