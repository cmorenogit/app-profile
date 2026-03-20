import { useState, useRef } from "react";
import { DemoShell } from "./DemoShell";
import { usePipelineManager } from "./usePipelineManager";
import { useMobileDetect } from "./useMobileDetect";
import { PRERECORDED_RESULTS } from "../../data/prerecorded-results";

interface ClassificationResult {
  label: string;
  score: number;
}

export function ImageDemo() {
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const mobileInfo = useMobileDetect();
  const isMobile = mobileInfo.isMobile;
  const { loadModel, isLoading: isModelLoading, progress, loadedBytes, totalBytes, status } = usePipelineManager(
    { task: "image-classification", modelId: "Xenova/vit-base-patch16-224", modelSizeMB: 88 },
    mobileInfo,
  );

  const classify = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setIsLoading(true);
    setResults([]);

    try {
      const pipe = await loadModel();
      if (!pipe) return;
      const output = await pipe(url);
      setResults((output as ClassificationResult[]).slice(0, 5));
    } catch (err) {
      console.error("Image classification error:", err);
    }
    setIsLoading(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) classify(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) classify(file);
  };

  if (status === "fallback") {
    return (
      <DemoShell
        title="Image Classification"
        howItWorks="A Vision Transformer (ViT) model analyzes your image and identifies what it contains, with confidence scores for the top 5 predictions. Runs entirely in your browser."
        modelName="vit-base-patch16-224"
        isLoading={false}
        isFallback={true}
        fallbackReason="This model (88MB) is too large for your device"
        modelSizeMB={88}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {PRERECORDED_RESULTS.image.map((r, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid rgba(100, 255, 218, 0.15)",
                background: "rgba(100, 255, 218, 0.05)",
              }}
            >
              <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "12px" }}>
                {r.input.label}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(r.output.topResults as ClassificationResult[]).map((pred, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{
                          color: j === 0 ? "#64ffda" : "#a8b2d1",
                          fontSize: "13px",
                          fontWeight: j === 0 ? 600 : 400,
                          textTransform: "capitalize",
                        }}>
                          {pred.label.replace(/_/g, " ")}
                        </span>
                        <span style={{ color: "#8892b0", fontSize: "12px", fontFamily: "'Geist Mono', monospace" }}>
                          {(pred.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div style={{
                        height: "4px",
                        borderRadius: "2px",
                        background: "rgba(100, 255, 218, 0.1)",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${pred.score * 100}%`,
                          borderRadius: "2px",
                          background: j === 0
                            ? "linear-gradient(90deg, #64ffda, #a78bfa)"
                            : "rgba(100, 255, 218, 0.3)",
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DemoShell>
    );
  }

  return (
    <DemoShell
      title="Image Classification"
      howItWorks="A Vision Transformer (ViT) model analyzes your image and identifies what it contains, with confidence scores for the top 5 predictions. Runs entirely in your browser."
      modelName="vit-base-patch16-224"
      isLoading={isModelLoading}
      progress={progress}
      loadedBytes={loadedBytes}
      totalBytes={totalBytes}
      modelSizeMB={88}
    >
      {/* Drop zone */}
      <div
        onClick={() => !isMobile && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          padding: preview ? "12px" : "40px 20px",
          borderRadius: "10px",
          border: `2px dashed ${dragOver ? "rgba(100, 255, 218, 0.4)" : "rgba(100, 255, 218, 0.15)"}`,
          background: dragOver ? "rgba(100, 255, 218, 0.05)" : "rgba(17, 34, 64, 0.3)",
          cursor: isMobile ? "default" : "pointer",
          textAlign: "center",
          transition: "border-color 0.2s, background 0.2s",
          marginBottom: "16px",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          style={{ display: "none" }}
        />

        {preview ? (
          <img
            src={preview}
            alt="Uploaded preview"
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "8px",
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : isMobile ? (
          <>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📷</div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid rgba(100, 255, 218, 0.2)",
                  background: "rgba(100, 255, 218, 0.1)",
                  color: "#64ffda",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Take Photo
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid rgba(100, 255, 218, 0.2)",
                  background: "rgba(17, 34, 64, 0.5)",
                  color: "#a8b2d1",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Choose from Gallery
              </button>
            </div>
            <p style={{ color: "#8892b0", fontSize: "12px", margin: "12px 0 0 0" }}>
              JPG, PNG, WebP — max 10MB
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📷</div>
            <p style={{ color: "#a8b2d1", fontSize: "14px", margin: "0 0 4px 0" }}>
              Drop an image here or click to upload
            </p>
            <p style={{ color: "#8892b0", fontSize: "12px", margin: 0 }}>
              JPG, PNG, WebP — max 10MB
            </p>
          </>
        )}
      </div>

      {isLoading && !isModelLoading && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{
            width: "16px", height: "16px",
            border: "2px solid rgba(100, 255, 218, 0.15)",
            borderTop: "2px solid #64ffda",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ color: "#a8b2d1", fontSize: "13px" }}>Classifying image...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div style={{
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid rgba(100, 255, 218, 0.15)",
          background: "rgba(100, 255, 218, 0.05)",
        }}>
          <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "12px" }}>
            Top predictions
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {results.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}>
                    <span style={{
                      color: i === 0 ? "#64ffda" : "#a8b2d1",
                      fontSize: "13px",
                      fontWeight: i === 0 ? 600 : 400,
                      textTransform: "capitalize",
                    }}>
                      {r.label.replace(/_/g, " ")}
                    </span>
                    <span style={{ color: "#8892b0", fontSize: "12px", fontFamily: "'Geist Mono', monospace" }}>
                      {(r.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{
                    height: "4px",
                    borderRadius: "2px",
                    background: "rgba(100, 255, 218, 0.1)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${r.score * 100}%`,
                      borderRadius: "2px",
                      background: i === 0
                        ? "linear-gradient(90deg, #64ffda, #a78bfa)"
                        : "rgba(100, 255, 218, 0.3)",
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DemoShell>
  );
}
