import { useState, useRef, useEffect, useCallback } from "react";

// --- B1: Streaming Refactor ---

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StreamResponseOptions {
  url: string;
  body: object;
  onChunk: (accumulatedText: string) => void;
  onError: (errorMessage: string) => void;
  onDone: () => void;
}

const ERROR_MESSAGE =
  "Something went wrong. You can reach Cesar directly on LinkedIn (linkedin.com/in/morenodev).";
const CONNECTION_ERROR =
  "Connection error. You can reach Cesar directly on LinkedIn (linkedin.com/in/morenodev).";

async function streamResponse(options: StreamResponseOptions): Promise<void> {
  const { url, body, onChunk, onError, onDone } = options;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      onError(error.error || ERROR_MESSAGE);
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      onDone();
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
            onChunk(accumulated);
          } catch {
            // skip invalid JSON
          }
        }
      }
    }

    onDone();
  } catch {
    onError(CONNECTION_ERROR);
  }
}

// --- B2: UX Improvements ---

const CHAT_VERSION = "2";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}

const STORAGE_KEY = `chat_messages_v${CHAT_VERSION}_${simpleHash("app-profile-chat")}`;
const VERSION_KEY = `chat_version`;

const WELCOME_MESSAGE =
  "Hi! I'm Cesar's AI assistant. Ask me about his experience, tech stack, availability, or anything else. I'm here to help!";

const SUGGESTIONS = [
  "What's his AI and LLM experience?",
  "Is he available for new opportunities?",
  "Can he lead engineering teams?",
  "What technologies does he use daily?",
  "Tell me about his most impactful project",
  "Does he work with US timezone clients?",
];

interface FollowUpCategory {
  keywords: string[];
  followUps: string[];
}

const FOLLOW_UP_MAP: FollowUpCategory[] = [
  {
    keywords: ["ai", "llm", "machine learning", "ml", "gpt", "model"],
    followUps: [
      "What AI tools has he built in production?",
      "Does he fine-tune models or use APIs?",
      "What's his approach to AI architecture?",
    ],
  },
  {
    keywords: ["available", "opportunities", "hire", "hiring", "freelance", "contract"],
    followUps: [
      "What type of roles interest him?",
      "What's his preferred engagement model?",
      "Can he start on short notice?",
    ],
  },
  {
    keywords: ["lead", "team", "manage", "engineering manager", "cto", "architect"],
    followUps: [
      "How large were the teams he's led?",
      "What's his leadership philosophy?",
      "Has he scaled engineering orgs?",
    ],
  },
  {
    keywords: ["technologies", "stack", "tools", "languages", "framework"],
    followUps: [
      "What cloud platforms does he use?",
      "Does he have DevOps experience?",
      "What databases has he worked with?",
    ],
  },
  {
    keywords: ["project", "impactful", "built", "product", "work"],
    followUps: [
      "What metrics did the project achieve?",
      "What technologies were used?",
      "What was his specific role?",
    ],
  },
  {
    keywords: ["timezone", "remote", "us", "collaborate", "communication"],
    followUps: [
      "What collaboration tools does he use?",
      "Has he worked with distributed teams?",
      "What's his availability for meetings?",
    ],
  },
];

function getFollowUps(lastUserMessage: string, lastAssistantMessage: string): string[] {
  const combined = (lastUserMessage + " " + lastAssistantMessage).toLowerCase();
  for (const category of FOLLOW_UP_MAP) {
    if (category.keywords.some((kw) => combined.includes(kw))) {
      return category.followUps.slice(0, 3);
    }
  }
  return ["What technologies does he use daily?", "Is he available for new opportunities?"];
}

// --- Component ---

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  // Session storage: load on mount
  useEffect(() => {
    try {
      const storedVersion = sessionStorage.getItem(VERSION_KEY);
      if (storedVersion !== CHAT_VERSION) {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.setItem(VERSION_KEY, CHAT_VERSION);
        return;
      }
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Session storage: save on every message update
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // ignore storage errors
      }
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // B3: Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        // Return focus to open button after close
        setTimeout(() => openButtonRef.current?.focus(), 0);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // B3: Focus trap
  useEffect(() => {
    if (!isOpen || !chatPanelRef.current) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const panel = chatPanelRef.current;
      if (!panel) return;

      const focusableElements = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleStreamMessage = useCallback(
    (messageText: string, history: Message[]) => {
      setIsLoading(true);
      setShowFollowUps(false);

      const userMsg: Message = { role: "user", content: messageText };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      const assistantMsg: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMsg]);

      streamResponse({
        url: "/api/chat",
        body: { message: messageText, history: history.slice(-6) },
        onChunk: (accumulatedText) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: accumulatedText,
            };
            return updated;
          });
        },
        onError: (errorMessage) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: errorMessage,
            };
            return updated;
          });
          setIsLoading(false);
        },
        onDone: () => {
          setIsLoading(false);
          // Show follow-up suggestions after response completes
          setMessages((prev) => {
            const lastUser = [...prev].reverse().find((m) => m.role === "user");
            const lastAssistant = [...prev].reverse().find((m) => m.role === "assistant");
            if (lastUser && lastAssistant) {
              setFollowUps(getFollowUps(lastUser.content, lastAssistant.content));
              setShowFollowUps(true);
            }
            return prev;
          });
        },
      });
    },
    []
  );

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setShowFollowUps(false);
    handleStreamMessage(trimmed, messages);
  }, [input, isLoading, messages, handleStreamMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasStoredMessages = messages.length > 0;
  const showWelcomeAndSuggestions = !hasStoredMessages;

  // Floating button (when chat is closed)
  if (!isOpen) {
    return (
      <button
        ref={openButtonRef}
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
          transition:
            "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease",
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  // Chat panel (when open)
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .chat-panel {
            width: 100% !important;
            max-width: 100% !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
            border: none !important;
            padding-top: env(safe-area-inset-top, 0px);
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }
          .chat-close-btn {
            min-width: 44px !important;
            min-height: 44px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
      <div
        ref={chatPanelRef}
        className="chat-panel"
        role="dialog"
        aria-label="Chat with Cesar's AI assistant"
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          zIndex: 50,
          width: "100%",
          maxWidth: "400px",
          height: "auto",
          maxHeight: "500px",
          display: "flex",
          flexDirection: "column",
          background: "rgba(10, 25, 47, 0.98)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(100, 255, 218, 0.1)",
          borderBottom: "none",
          borderRight: "none",
          borderTopLeftRadius: "16px",
          boxShadow:
            "0 -4px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(100, 255, 218, 0.03)",
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
            <span
              style={{ color: "#e6f1ff", fontSize: "14px", fontWeight: 600 }}
            >
              Ask about Cesar
            </span>
          </div>
          <button
            ref={closeButtonRef}
            className="chat-close-btn"
            onClick={() => {
              setIsOpen(false);
              setTimeout(() => openButtonRef.current?.focus(), 0);
            }}
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#e6f1ff")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#8892b0")
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          role="log"
          aria-live="polite"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minHeight: "200px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Welcome message + suggestions when no history */}
          {showWelcomeAndSuggestions && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Welcome bubble */}
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius: "12px 12px 12px 2px",
                    background: "rgba(17, 34, 64, 0.6)",
                    border: "1px solid rgba(100, 255, 218, 0.05)",
                    color: "#c0c8e0",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  {WELCOME_MESSAGE}
                </div>
              </div>

              {/* Suggestion buttons */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  padding: "4px 0",
                }}
              >
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      handleStreamMessage(suggestion, []);
                    }}
                    style={{
                      background: "rgba(17, 34, 64, 0.5)",
                      border: "1px solid rgba(100, 255, 218, 0.08)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      color: "#c0c8e0",
                      fontSize: "12px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(100, 255, 218, 0.2)";
                      e.currentTarget.style.color = "#e6f1ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(100, 255, 218, 0.08)";
                      e.currentTarget.style.color = "#c0c8e0";
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius:
                    msg.role === "user"
                      ? "12px 12px 2px 12px"
                      : "12px 12px 12px 2px",
                  background:
                    msg.role === "user"
                      ? "rgba(100, 255, 218, 0.1)"
                      : "rgba(17, 34, 64, 0.6)",
                  border: `1px solid ${
                    msg.role === "user"
                      ? "rgba(100, 255, 218, 0.15)"
                      : "rgba(100, 255, 218, 0.05)"
                  }`,
                  color: msg.role === "user" ? "#e6f1ff" : "#c0c8e0",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                {msg.content || (
                  <span style={{ display: "inline-flex", gap: "4px" }}>
                    <span
                      style={{
                        animation: "pulse-dot 1s ease-in-out infinite",
                      }}
                    >
                      ·
                    </span>
                    <span
                      style={{
                        animation:
                          "pulse-dot 1s ease-in-out 0.2s infinite",
                      }}
                    >
                      ·
                    </span>
                    <span
                      style={{
                        animation:
                          "pulse-dot 1s ease-in-out 0.4s infinite",
                      }}
                    >
                      ·
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Follow-up suggestions after assistant response */}
          {showFollowUps && !isLoading && followUps.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                paddingTop: "4px",
              }}
            >
              {followUps.map((fu) => (
                <button
                  key={fu}
                  onClick={() => {
                    setShowFollowUps(false);
                    handleStreamMessage(fu, messages);
                  }}
                  style={{
                    background: "rgba(17, 34, 64, 0.4)",
                    border: "1px solid rgba(100, 255, 218, 0.1)",
                    borderRadius: "16px",
                    padding: "6px 12px",
                    color: "#64ffda",
                    fontSize: "11px",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(100, 255, 218, 0.25)";
                    e.currentTarget.style.background =
                      "rgba(17, 34, 64, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(100, 255, 218, 0.1)";
                    e.currentTarget.style.background =
                      "rgba(17, 34, 64, 0.4)";
                  }}
                >
                  {fu}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          style={{
            padding: "12px 16px",
            paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
            borderTop: "1px solid rgba(100, 255, 218, 0.08)",
            display: "flex",
            gap: "8px",
            flexShrink: 0,
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
            aria-label="Type your message"
            style={{
              flex: 1,
              background: "rgba(17, 34, 64, 0.5)",
              border: "1px solid rgba(100, 255, 218, 0.1)",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "#e6f1ff",
              fontSize: "16px",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor =
                "rgba(100, 255, 218, 0.25)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor =
                "rgba(100, 255, 218, 0.1)")
            }
          />
          <button
            ref={sendButtonRef}
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            style={{
              background:
                isLoading || !input.trim()
                  ? "rgba(100, 255, 218, 0.05)"
                  : "rgba(100, 255, 218, 0.1)",
              border: "1px solid rgba(100, 255, 218, 0.15)",
              borderRadius: "8px",
              padding: "0 14px",
              color:
                isLoading || !input.trim() ? "#233554" : "#64ffda",
              cursor:
                isLoading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
