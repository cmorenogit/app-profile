import { useState } from "react";
import { DemoShell } from "./DemoShell";
import { usePipelineManager } from "./usePipelineManager";
import { useMobileDetect } from "./useMobileDetect";
import { PRERECORDED_RESULTS } from "../../data/prerecorded-results";
import { playgroundStrings, type PlaygroundStrings } from "../../i18n/playground";

const EXAMPLE_TEXT = `Artificial intelligence has transformed the software industry in fundamental ways. What once required teams of specialized engineers working for months can now be accomplished in days with the help of AI-powered tools. Code generation, automated testing, and intelligent debugging have become standard practices. However, the most significant impact has been in how developers think about problem-solving — shifting from writing every line manually to orchestrating AI agents that handle repetitive tasks while humans focus on architecture and creative decisions.`;

export function SummaryDemo({ t = playgroundStrings.en }: { t?: PlaygroundStrings }) {
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
    try {
      const pipe = await loadModel();
      if (!pipe) return;
      const output = await pipe(value, { max_new_tokens: 80, min_length: 10 });
      setSummary((output as any)[0]?.summary_text || t.summary.couldNotGenerate);
    } catch (err) {
      console.error("Summary error:", err);
      setSummary(t.summary.errorGenerating);
    }
    setIsLoading(false);
  };

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const tooShort = wordCount > 0 && wordCount < 15;

  if (status === "fallback") {
    return (
      <DemoShell
        title={t.demos.summary.title}
        howItWorks={t.summary.howItWorks}
        modelName="distilbart-cnn-6-6"
        isLoading={false}
        isFallback={true}
        fallbackReason={t.summary.fallbackReason}
        modelSizeMB={305}
        t={t.shell}
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
                {t.summary.summary}
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
      title={t.demos.summary.title}
      howItWorks={t.summary.howItWorks}
      modelName="distilbart-cnn-6-6"
      isLoading={isModelLoading}
      loadingText={t.summary.loadingText}
      progress={progress}
      loadedBytes={loadedBytes}
      totalBytes={totalBytes}
      modelSizeMB={305}
      t={t.shell}
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
          {t.summary.tryExample}
        </button>
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t.summary.placeholder}
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
          {wordCount} {t.summary.words} {tooShort && t.summary.needAtLeast}
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
        {isLoading ? t.summary.summarizing : t.summary.summarize}
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
            {t.summary.summary}
          </span>
          <p style={{ color: "#e6f1ff", fontSize: "15px", lineHeight: 1.6, margin: 0 }}>
            {summary}
          </p>
        </div>
      )}
    </DemoShell>
  );
}
