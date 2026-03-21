import { useState } from "react";
import { DemoShell } from "./DemoShell";
import { usePipelineManager } from "./usePipelineManager";
import { useMobileDetect } from "./useMobileDetect";
import { PRERECORDED_RESULTS } from "../../data/prerecorded-results";

interface SentimentResult {
  label: string;
  score: number;
}

const EXAMPLES = [
  "I absolutely love this new AI technology, it's incredible!",
  "The service was terrible and I'm very disappointed.",
  "The meeting is scheduled for 3pm tomorrow.",
];

const SENTIMENT_COLORS: Record<string, string> = {
  POSITIVE: "#64ffda",
  NEGATIVE: "#ff6b6b",
  NEUTRAL: "#8892b0",
};

const SENTIMENT_LABELS: Record<string, string> = {
  POSITIVE: "Positive",
  NEGATIVE: "Negative",
  NEUTRAL: "Neutral",
};

export function SentimentDemo() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<SentimentResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mobileInfo = useMobileDetect();
  const { loadModel, isLoading: isModelLoading, progress, loadedBytes, totalBytes, status } = usePipelineManager(
    { task: "sentiment-analysis", modelId: "Xenova/distilbert-base-uncased-finetuned-sst-2-english", modelSizeMB: 67, mobileDtype: "q8" },
    mobileInfo,
  );

  const analyze = async (text?: string) => {
    const value = (text || input).trim();
    if (!value) return;
    if (text) setInput(text);
    setIsLoading(true);
    setResults(null);
    try {
      const pipe = await loadModel();
      if (!pipe) return;
      const output = await pipe(value);
      setResults(output as SentimentResult[]);
    } catch (err) {
      console.error("Sentiment analysis error:", err);
    }
    setIsLoading(false);
  };

  const topResult = results?.[0];
  const sentimentKey = topResult?.label?.toUpperCase() || "";

  if (status === "fallback") {
    return (
      <DemoShell
        title="Sentiment Analysis"
        howItWorks="A DistilBERT model analyzes your text and classifies its emotional tone as positive, negative, or neutral. Everything runs in your browser via WebAssembly."
        modelName="distilbert-sst2"
        isLoading={false}
        isFallback={true}
        fallbackReason="This model (67MB) is too large for your device"
        modelSizeMB={67}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {PRERECORDED_RESULTS.sentiment.map((r, i) => {
            const key = r.output.label?.toUpperCase() || "";
            return (
              <div
                key={i}
                style={{
                  padding: "16px",
                  borderRadius: "10px",
                  border: `1px solid ${SENTIMENT_COLORS[key]}33`,
                  background: `${SENTIMENT_COLORS[key]}08`,
                }}
              >
                <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                  {r.input.label}: &quot;{r.input.value}&quot;
                </span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    color: SENTIMENT_COLORS[key] || "#e6f1ff",
                    fontSize: "20px",
                    fontWeight: 700,
                  }}>
                    {SENTIMENT_LABELS[key] || r.output.label}
                  </span>
                  <span style={{ color: "#e6f1ff", fontSize: "16px", fontWeight: 700 }}>
                    {(r.output.score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </DemoShell>
    );
  }

  return (
    <DemoShell
      title="Sentiment Analysis"
      howItWorks="A DistilBERT model analyzes your text and classifies its emotional tone as positive, negative, or neutral. Everything runs in your browser via WebAssembly."
      modelName="distilbert-sst2"
      isLoading={isModelLoading}
      progress={progress}
      loadedBytes={loadedBytes}
      totalBytes={totalBytes}
      modelSizeMB={67}
    >
      {/* Examples */}
      <div style={{ marginBottom: "16px" }}>
        <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "8px" }}>
          Try an example:
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => analyze(ex)}
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
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.1)")}
            >
              "{ex.slice(0, 40)}..."
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste any text to analyze..."
          maxLength={500}
          rows={3}
          style={{
            flex: 1,
            background: "rgba(17, 34, 64, 0.5)",
            border: "1px solid rgba(100, 255, 218, 0.1)",
            borderRadius: "8px",
            padding: "12px",
            color: "#e6f1ff",
            fontSize: "14px",
            fontFamily: "inherit",
            resize: "vertical",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.25)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.1)")}
        />
      </div>

      <button
        onClick={() => analyze()}
        disabled={isLoading || !input.trim()}
        style={{
          padding: "10px 24px",
          borderRadius: "8px",
          border: "1px solid rgba(100, 255, 218, 0.2)",
          background: isLoading || !input.trim() ? "rgba(100, 255, 218, 0.03)" : "rgba(100, 255, 218, 0.1)",
          color: isLoading || !input.trim() ? "#233554" : "#64ffda",
          fontSize: "14px",
          fontWeight: 500,
          cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
          transition: "background 0.2s, transform 0.1s",
          marginBottom: "16px",
        }}
      >
        {isLoading ? "Analyzing..." : "Analyze Sentiment"}
      </button>

      {/* Result */}
      {topResult && (
        <div style={{
          padding: "20px",
          borderRadius: "10px",
          border: `1px solid ${SENTIMENT_COLORS[sentimentKey]}33`,
          background: `${SENTIMENT_COLORS[sentimentKey]}08`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "4px" }}>
              Result
            </span>
            <span style={{
              color: SENTIMENT_COLORS[sentimentKey] || "#e6f1ff",
              fontSize: "24px",
              fontWeight: 700,
            }}>
              {SENTIMENT_LABELS[sentimentKey] || topResult.label}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "4px" }}>
              Confidence
            </span>
            <span style={{ color: "#e6f1ff", fontSize: "24px", fontWeight: 700 }}>
              {(topResult.score * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </DemoShell>
  );
}
