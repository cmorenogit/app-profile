import { type ReactNode } from "react";

interface DemoShellProps {
  title: string;
  howItWorks: string;
  modelName: string;
  children: ReactNode;
  isLoading: boolean;
  loadingText?: string;
  device?: "webgpu" | "wasm";
  progress?: number;
  loadedBytes?: number;
  totalBytes?: number;
  modelSizeMB?: number;
  isFallback?: boolean;
  fallbackReason?: string;
}

export function DemoShell({ title, howItWorks, modelName, children, isLoading, loadingText, device, progress, loadedBytes, totalBytes, modelSizeMB, isFallback, fallbackReason }: DemoShellProps) {
  const formatMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ color: "#e6f1ff", fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
          {title}
        </h3>
        <p style={{ color: "#8892b0", fontSize: "13px", lineHeight: 1.5, margin: "0 0 8px 0" }}>
          <strong style={{ color: "#a8b2d1" }}>How it works:</strong> {howItWorks}
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}>
            Model: {modelName}
          </span>
          {device && (
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              borderRadius: "6px",
              background: device === "webgpu" ? "rgba(100, 255, 218, 0.1)" : "rgba(136, 146, 176, 0.1)",
              border: `1px solid ${device === "webgpu" ? "rgba(100, 255, 218, 0.2)" : "rgba(136, 146, 176, 0.15)"}`,
              fontSize: "11px",
              color: device === "webgpu" ? "#64ffda" : "#8892b0",
              fontFamily: "'Geist Mono', monospace",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>
              {device === "webgpu" ? "⚡ WebGPU" : "🔧 WASM"}
            </span>
          )}
          {modelSizeMB != null && (
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 10px",
              borderRadius: "6px",
              background: "rgba(136, 146, 176, 0.1)",
              border: "1px solid rgba(136, 146, 176, 0.15)",
              fontSize: "11px",
              color: "#8892b0",
              fontFamily: "'Geist Mono', monospace",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}>
              ~{modelSizeMB} MB
            </span>
          )}
        </div>
      </div>

      {isLoading && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "16px",
          borderRadius: "8px",
          background: "rgba(100, 255, 218, 0.03)",
          border: "1px solid rgba(100, 255, 218, 0.08)",
          marginBottom: "16px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}>
          {progress != null && progress > 0 ? (
            <>
              <div style={{
                width: "100%",
                height: "6px",
                borderRadius: "3px",
                background: "rgba(100, 255, 218, 0.1)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${Math.min(progress, 100)}%`,
                  height: "100%",
                  borderRadius: "3px",
                  background: "#64ffda",
                  transition: "width 0.3s ease",
                }} />
              </div>
              <span style={{ color: "#a8b2d1", fontSize: "13px", textAlign: "center" }}>
                Downloading model... {loadedBytes != null ? formatMB(loadedBytes) : "0.0"} / {totalBytes != null ? formatMB(totalBytes) : "?"} MB
              </span>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "20px",
                height: "20px",
                flexShrink: 0,
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
        </div>
      )}

      {isFallback && (
        <div style={{
          background: "rgba(167, 139, 250, 0.08)",
          border: "1px solid rgba(167, 139, 250, 0.15)",
          borderRadius: "10px",
          padding: "16px",
          marginBottom: "16px",
          fontSize: "13px",
          lineHeight: 1.5,
        }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <span style={{ flexShrink: 0 }}>ℹ️</span>
            <div>
              <p style={{ color: "#a8b2d1", margin: 0 }}>
                Showing pre-computed results — {fallbackReason || "this model requires more memory than your device can provide"}.
              </p>
              <p style={{ color: "#8892b0", margin: "6px 0 0 0" }}>
                Try on a desktop device for the full interactive experience.
              </p>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
