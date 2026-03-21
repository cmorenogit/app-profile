import { useState, useRef, useEffect } from "react";
import { DemoShell } from "./DemoShell";
import { usePipelineManager } from "./usePipelineManager";
import { useMobileDetect } from "./useMobileDetect";
import { PRERECORDED_RESULTS } from "../../data/prerecorded-results";

interface ChunkResult {
  text: string;
  similarity: number;
}

const PORTFOLIO_CHUNKS = [
  "Cesar Moreno is a Full Stack Engineer specializing in AI with 13+ years of production experience. Currently at Apprecio building automation solutions with AI agents.",
  "Built multi-agent system for automated PR code reviews with security-focused analysis. Supports Claude, GPT-4, and Gemini with 97.5% token cost reduction through intelligent caching.",
  "Apprecio Rewards Platform serves 500K+ users across 6 LATAM countries. 13+ microservices with 25% performance improvement and 40% faster delivery through AI-powered automation.",
  "Core expertise: TypeScript, Node.js, NestJS, React, PostgreSQL with Row-Level Security, AWS, LangChain, Claude API. Multi-tenant architecture with data isolation.",
  "Prism is a CLI tool that orchestrates structured debates between Claude, GPT, and Gemini. Six analysis modes produce bias-reduced insights through multi-perspective synthesis.",
  "AI Playground runs models entirely in the browser using Transformers.js and WebGPU. Sentiment analysis, text summarization, image classification — zero server cost, 100% private.",
  "Development workflow uses Spec-Driven Development (SDD), Claude Code CLI with MCP servers, Engram for persistent memory, and bd (beads) for issue tracking.",
  "Tech stack includes Astro, React 19, Tailwind CSS 4, Framer Motion, Playwright for E2E testing, Vitest for unit tests, and GitHub Actions for CI/CD.",
];

const EXAMPLES = [
  "What AI tools does Cesar use?",
  "How many countries does the platform serve?",
  "What is Prism?",
];

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function RAGDemo() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ChunkResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryEmbeddingPreview, setQueryEmbeddingPreview] = useState<number[]>([]);
  const chunkEmbeddingsRef = useRef<number[][] | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const mobileInfo = useMobileDetect();
  const { loadModel, isLoading: isModelLoading, progress, loadedBytes, totalBytes, status } = usePipelineManager(
    { task: "feature-extraction", modelId: "Xenova/all-MiniLM-L6-v2", modelSizeMB: 23, mobileDtype: "q8" },
    mobileInfo,
  );

  // Scroll to results when they appear
  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [results]);

  const loadModelAndEmbeddings = async () => {
    const pipe = await loadModel();
    if (!pipe) return null;

    // Pre-compute chunk embeddings if not already done
    if (!chunkEmbeddingsRef.current) {
      const embeddings: number[][] = [];
      for (const chunk of PORTFOLIO_CHUNKS) {
        const output = await pipe(chunk, { pooling: "mean", normalize: true });
        embeddings.push(Array.from(output.data as Float32Array));
      }
      chunkEmbeddingsRef.current = embeddings;
    }

    return pipe;
  };

  const search = async (text?: string) => {
    const value = (text || input).trim();
    if (!value) return;
    if (text) setInput(text);
    setIsLoading(true);

    try {
      const pipe = await loadModelAndEmbeddings();
      if (!pipe) return;
      const queryOutput = await pipe(value, { pooling: "mean", normalize: true });
      const queryEmb = Array.from(queryOutput.data as Float32Array);
      setQueryEmbeddingPreview(queryEmb.slice(0, 20));

      const scored = PORTFOLIO_CHUNKS.map((chunk, i) => ({
        text: chunk,
        similarity: cosineSimilarity(queryEmb, chunkEmbeddingsRef.current![i]),
      }));

      scored.sort((a, b) => b.similarity - a.similarity);
      setResults(scored.slice(0, 4));
    } catch (err) {
      console.error("RAG error:", err);
    }
    setIsLoading(false);
  };

  if (status === "fallback") {
    return (
      <DemoShell
        title="RAG Explorer"
        howItWorks="Your query is converted to a vector embedding, then compared against pre-embedded portfolio chunks using cosine similarity. The most relevant chunks surface as results. Everything runs in your browser — no server involved."
        modelName="all-MiniLM-L6-v2"
        isLoading={false}
        isFallback={true}
        fallbackReason="This model (23MB) is too large for your device"
        modelSizeMB={23}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {PRERECORDED_RESULTS.rag.map((r, i) => (
            <div
              key={i}
              style={{
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid rgba(100, 255, 218, 0.15)",
                background: "rgba(100, 255, 218, 0.03)",
              }}
            >
              <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "8px" }}>
                Query: &quot;{r.input.value}&quot;
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(r.output.results as { text: string; score: number }[]).map((chunk, j) => (
                  <div
                    key={j}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      background: j === 0 ? "rgba(100, 255, 218, 0.06)" : "rgba(17, 34, 64, 0.3)",
                      border: `1px solid ${j === 0 ? "rgba(100, 255, 218, 0.15)" : "rgba(100, 255, 218, 0.05)"}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{
                        color: j === 0 ? "#64ffda" : "#8892b0",
                        fontSize: "11px",
                        fontFamily: "'Geist Mono', monospace",
                      }}>
                        #{j + 1} — similarity: {(chunk.score * 100).toFixed(1)}%
                      </span>
                      <div style={{
                        width: "60px",
                        height: "4px",
                        borderRadius: "2px",
                        background: "rgba(100, 255, 218, 0.1)",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${chunk.score * 100}%`,
                          borderRadius: "2px",
                          background: j === 0
                            ? "linear-gradient(90deg, #64ffda, #a78bfa)"
                            : "rgba(100, 255, 218, 0.3)",
                        }} />
                      </div>
                    </div>
                    <p style={{
                      color: j === 0 ? "#e6f1ff" : "#a8b2d1",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      margin: 0,
                    }}>
                      {chunk.text}
                    </p>
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
      title="RAG Explorer"
      howItWorks="Your query is converted to a vector embedding, then compared against pre-embedded portfolio chunks using cosine similarity. The most relevant chunks surface as results. Everything runs in your browser — no server involved."
      modelName="all-MiniLM-L6-v2"
      isLoading={isModelLoading}
      loadingText="Loading embedding model + indexing portfolio... (first time takes ~10s)"
      progress={progress}
      loadedBytes={loadedBytes}
      totalBytes={totalBytes}
      modelSizeMB={23}
    >
      {/* Examples */}
      <div style={{ marginBottom: "16px" }}>
        <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "8px" }}>
          Try a query:
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => search(ex)}
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
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Ask anything about Cesar's portfolio..."
          maxLength={200}
          style={{
            flex: 1,
            background: "rgba(17, 34, 64, 0.5)",
            border: "1px solid rgba(100, 255, 218, 0.1)",
            borderRadius: "8px",
            padding: "10px 14px",
            color: "#e6f1ff",
            fontSize: "14px",
            fontFamily: "inherit",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.25)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.1)")}
        />
        <button
          onClick={() => search()}
          disabled={isLoading || !input.trim()}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid rgba(100, 255, 218, 0.2)",
            background: isLoading || !input.trim() ? "rgba(100, 255, 218, 0.03)" : "rgba(100, 255, 218, 0.1)",
            color: isLoading || !input.trim() ? "#233554" : "#64ffda",
            fontSize: "14px",
            fontWeight: 500,
            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Searching indicator */}
      {isLoading && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 16px",
          borderRadius: "8px",
          background: "rgba(100, 255, 218, 0.03)",
          border: "1px solid rgba(100, 255, 218, 0.08)",
          marginBottom: "16px",
        }}>
          <div style={{
            width: "16px", height: "16px",
            border: "2px solid rgba(100, 255, 218, 0.15)",
            borderTop: "2px solid #64ffda",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ color: "#a8b2d1", fontSize: "13px" }}>
            Computing embeddings and searching...
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Query embedding preview */}
      {queryEmbeddingPreview.length > 0 && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "8px",
          background: "rgba(167, 139, 250, 0.05)",
          border: "1px solid rgba(167, 139, 250, 0.1)",
          marginBottom: "16px",
        }}>
          <span style={{ color: "#a78bfa", fontSize: "11px", fontFamily: "'Geist Mono', monospace", display: "block", marginBottom: "6px" }}>
            Query embedding (first 20 of 384 dimensions):
          </span>
          <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
            {queryEmbeddingPreview.map((v, i) => (
              <span
                key={i}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "3px",
                  background: v > 0
                    ? `rgba(100, 255, 218, ${Math.min(Math.abs(v) * 3, 1)})`
                    : `rgba(255, 107, 107, ${Math.min(Math.abs(v) * 3, 1)})`,
                  display: "inline-block",
                }}
                title={v.toFixed(4)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div
          ref={resultsRef}
          style={{
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid rgba(100, 255, 218, 0.15)",
            background: "rgba(100, 255, 218, 0.03)",
            opacity: isLoading ? 0.4 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          <span style={{ color: "#8892b0", fontSize: "12px", display: "block", marginBottom: "12px" }}>
            Top matching chunks (by cosine similarity)
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: i === 0 ? "rgba(100, 255, 218, 0.06)" : "rgba(17, 34, 64, 0.3)",
                  border: `1px solid ${i === 0 ? "rgba(100, 255, 218, 0.15)" : "rgba(100, 255, 218, 0.05)"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{
                    color: i === 0 ? "#64ffda" : "#8892b0",
                    fontSize: "11px",
                    fontFamily: "'Geist Mono', monospace",
                  }}>
                    #{i + 1} — similarity: {(r.similarity * 100).toFixed(1)}%
                  </span>
                  {/* Similarity bar */}
                  <div style={{
                    width: "60px",
                    height: "4px",
                    borderRadius: "2px",
                    background: "rgba(100, 255, 218, 0.1)",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${r.similarity * 100}%`,
                      borderRadius: "2px",
                      background: i === 0
                        ? "linear-gradient(90deg, #64ffda, #a78bfa)"
                        : "rgba(100, 255, 218, 0.3)",
                    }} />
                  </div>
                </div>
                <p style={{
                  color: i === 0 ? "#e6f1ff" : "#a8b2d1",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </DemoShell>
  );
}
