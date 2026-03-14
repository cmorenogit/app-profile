import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: error.error || "Something went wrong.",
          };
          return updated;
        });
        setIsLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setIsLoading(false);
        return;
      }

      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              accumulated += parsed.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: accumulated,
                };
                return updated;
              });
            } catch {
              // skip invalid JSON
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Connection error. Please try again.",
        };
        return updated;
      });
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Floating button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 50,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(17, 34, 64, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(100, 255, 218, 0.15)",
          color: "#64ffda",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease",
          boxShadow: "0 0 20px rgba(100, 255, 218, 0.08)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.3)";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.15)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  // Chat panel
  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        right: "0",
        zIndex: 50,
        width: "100%",
        maxWidth: "400px",
        height: "100dvh",
        maxHeight: "500px",
        display: "flex",
        flexDirection: "column",
        background: "rgba(10, 25, 47, 0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(100, 255, 218, 0.1)",
        borderBottom: "none",
        borderRight: "none",
        borderTopLeftRadius: "16px",
        boxShadow: "0 -4px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(100, 255, 218, 0.03)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(100, 255, 218, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#64ffda",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
          />
          <span style={{ color: "#e6f1ff", fontSize: "14px", fontWeight: 600 }}>
            Ask about Cesar
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
          style={{
            background: "none",
            border: "none",
            color: "#8892b0",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e6f1ff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8892b0")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ color: "#8892b0", fontSize: "13px", marginBottom: "16px" }}>
              Ask me anything about Cesar's experience, skills, or projects.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "What's his AI experience?",
                "What technologies does he use?",
                "Tell me about his projects",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    const userMsg: Message = { role: "user", content: suggestion };
                    setMessages((prev) => [...prev, userMsg]);
                    setInput("");
                    setIsLoading(true);
                    const assistantMsg: Message = { role: "assistant", content: "" };
                    setMessages((prev) => [...prev, assistantMsg]);
                    fetch("/api/chat", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ message: suggestion, history: [] }),
                    }).then(async (res) => {
                      if (!res.ok) {
                        const err = await res.json();
                        setMessages((prev) => {
                          const u = [...prev];
                          u[u.length - 1] = { role: "assistant", content: err.error || "Error." };
                          return u;
                        });
                        setIsLoading(false);
                        return;
                      }
                      const reader = res.body?.getReader();
                      const decoder = new TextDecoder();
                      if (!reader) { setIsLoading(false); return; }
                      let acc = "";
                      while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value, { stream: true });
                        for (const line of chunk.split("\n")) {
                          if (line.startsWith("data: ")) {
                            const d = line.slice(6);
                            if (d === "[DONE]") break;
                            try {
                              acc += JSON.parse(d).text;
                              setMessages((prev) => {
                                const u = [...prev];
                                u[u.length - 1] = { role: "assistant", content: acc };
                                return u;
                              });
                            } catch {}
                          }
                        }
                      }
                      setIsLoading(false);
                    }).catch(() => {
                      setMessages((prev) => {
                        const u = [...prev];
                        u[u.length - 1] = { role: "assistant", content: "Connection error." };
                        return u;
                      });
                      setIsLoading(false);
                    });
                  }}
                  style={{
                    background: "rgba(17, 34, 64, 0.5)",
                    border: "1px solid rgba(100, 255, 218, 0.08)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    color: "#a8b2d1",
                    fontSize: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.2)";
                    e.currentTarget.style.color = "#e6f1ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.08)";
                    e.currentTarget.style.color = "#a8b2d1";
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                background:
                  msg.role === "user"
                    ? "rgba(100, 255, 218, 0.1)"
                    : "rgba(17, 34, 64, 0.6)",
                border: `1px solid ${msg.role === "user" ? "rgba(100, 255, 218, 0.15)" : "rgba(100, 255, 218, 0.05)"}`,
                color: msg.role === "user" ? "#e6f1ff" : "#a8b2d1",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              {msg.content || (
                <span style={{ display: "inline-flex", gap: "4px" }}>
                  <span style={{ animation: "pulse-dot 1s ease-in-out infinite" }}>·</span>
                  <span style={{ animation: "pulse-dot 1s ease-in-out 0.2s infinite" }}>·</span>
                  <span style={{ animation: "pulse-dot 1s ease-in-out 0.4s infinite" }}>·</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(100, 255, 218, 0.08)",
          display: "flex",
          gap: "8px",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          maxLength={500}
          disabled={isLoading}
          style={{
            flex: 1,
            background: "rgba(17, 34, 64, 0.5)",
            border: "1px solid rgba(100, 255, 218, 0.1)",
            borderRadius: "8px",
            padding: "10px 14px",
            color: "#e6f1ff",
            fontSize: "13px",
            outline: "none",
            fontFamily: "inherit",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.25)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(100, 255, 218, 0.1)")}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          style={{
            background: isLoading || !input.trim() ? "rgba(100, 255, 218, 0.05)" : "rgba(100, 255, 218, 0.1)",
            border: "1px solid rgba(100, 255, 218, 0.15)",
            borderRadius: "8px",
            padding: "0 14px",
            color: isLoading || !input.trim() ? "#233554" : "#64ffda",
            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
