import { useState } from "react";
import { track } from "@vercel/analytics/react";
import { DemoShell } from "./DemoShell";
import { usePipelineManager } from "./usePipelineManager";
import { useMobileDetect } from "./useMobileDetect";
import { PRERECORDED_RESULTS } from "../../data/prerecorded-results";

const EXAMPLE_TEXT = `Artificial intelligence has transformed the software industry in fundamental ways. What once required teams of specialized engineers working for months can now be accomplished in days with the help of AI-powered tools. Code generation, automated testing, and intelligent debugging have become standard practices. However, the most significant impact has been in how developers think about problem-solving — shifting from writing every line manually to orchestrating AI agents that handle repetitive tasks while humans focus on architecture and creative decisions.`;

export function SummaryDemo() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mobileInfo = useMobileDetect();
  const { loadModel, isLoading: isModelLoading, progress, loadedBytes, totalBytes, status } = usePipelineManager(
    { task: "summarization", modelId: "Xenova/distilbart-cnn-6-6", modelSizeMB: 305, mobileDtype: "q8" },
    mobileInfo,
  );

  const summarize = async (text?: string) => {
    const value = (text || input).trim();
    if (!value || value.split(/\s+/).length < 15) return;
    if (text) setInput(text);
    setIsLoading(true);
    setSummary("");
    const startTime = Date.now();
    try {
      const pipe = await loadModel();
      if (!pipe) return;
      const output = await pipe(value, { max_new_tokens: 80, min_length: 10 });
      setSummary((output as any)[0]?.summary_text || "Could not generate summary.");
      track("demo_completed", { demo: "summary", duration_ms: Date.now() - startTime });
    } catch (err) {
      console.error("Summary error:", err);
      setSummary("Error generating summary. Try a longer text.");
    }
    setIsLoading(false);
  };

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const tooShort = wordCount > 0 && wordCount < 15;

  if (status === "fallback") {
    return (
      <DemoShell
        title="Text Summary"
        howItWorks="A DistilBART model reads your text and generates a concise summary capturing the key points. Requires at least 15 words of input. Runs entirely in your browser."
        modelName="distilbart-cnn-6-6"
        isLoading={false}
        isFallback={true}
        fallbackReason="This model (305MB) is too large for your device"
        modelSizeMB={305}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {PRERECORDED_RESULTS.summary.map((r, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid rgba(100, 255, 218, 0.15)",
                background: "rgba(100, 255, 218, 0.05)",
              }}
            >
              <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                {r.input.label}
              </span>
              <p style={{ color: "#a8b2d1", fontSize: "13px", lineHeight: 1.5, margin: "0 0 12px 0", fontStyle: "italic" }}>
                &quot;{r.input.value}&quot;
              </p>
              <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                Summary
              </span>
              <p style={{ color: "#e6f1ff", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
                {r.output.summary_text}
              </p>
            </div>
          ))}
        </div>
      </DemoShell>
    );
  }

  return (
    <DemoShell
      title="Text Summary"
      howItWorks="A DistilBART model reads your text and generates a concise summary capturing the key points. Requires at least 15 words of input. Runs entirely in your browser."
      modelName="distilbart-cnn-6-6"
      isLoading={isModelLoading}
      loadingText="Loading summarization model... (first time takes ~15s)"
      progress={progress}
      loadedBytes={loadedBytes}
      totalBytes={totalBytes}
      modelSizeMB={305}
    >
      {/* Example */}
      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={() => summarize(EXAMPLE_TEXT)}
          disabled={isLoading}
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid rgba(100, 255, 218, 0.1)",
            background: "rgba(17, 34, 64, 0.5)",
            color: "#a8b2d1",
            fontSize: "12px",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.25)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.1)")}
        >
          Try example: AI impact on software development
        </button>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a paragraph (at least 15 words) to summarize..."
        maxLength={2000}
        rows={5}
        style={{
          width: "100%",
          background: "rgba(17, 34, 64, 0.5)",
          border: `1px solid ${tooShort ? "rgba(255, 107, 107, 0.3)" : "rgba(100, 255, 218, 0.1)"}`,
          borderRadius: "8px",
          padding: "12px",
          color: "#e6f1ff",
          fontSize: "14px",
          fontFamily: "inherit",
          resize: "vertical",
          outline: "none",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
          marginBottom: "8px",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.25)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = tooShort ? "rgba(255, 107, 107, 0.3)" : "rgba(100, 255, 218, 0.1)")}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ color: tooShort ? "#ff6b6b" : "#8892b0", fontSize: "12px" }}>
          {wordCount} words {tooShort && "— need at least 15"}
        </span>
      </div>

      <button
        onClick={() => summarize()}
        disabled={isLoading || tooShort || !input.trim()}
        style={{
          padding: "10px 24px",
          borderRadius: "8px",
          border: "1px solid rgba(100, 255, 218, 0.2)",
          background: isLoading || tooShort || !input.trim() ? "rgba(100, 255, 218, 0.03)" : "rgba(100, 255, 218, 0.1)",
          color: isLoading || tooShort || !input.trim() ? "#233554" : "#64ffda",
          fontSize: "14px",
          fontWeight: 500,
          cursor: isLoading || tooShort || !input.trim() ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          marginBottom: "16px",
        }}
      >
        {isLoading ? "Summarizing..." : "Summarize"}
      </button>

      {/* Result */}
      {summary && (
        <div style={{
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid rgba(100, 255, 218, 0.15)",
          background: "rgba(100, 255, 218, 0.05)",
        }}>
          <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "8px" }}>
            Summary
          </span>
          <p style={{ color: "#e6f1ff", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
            {summary}
          </p>
        </div>
      )}
    </DemoShell>
  );
}
