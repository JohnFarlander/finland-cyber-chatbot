
import { useEffect, useRef, useState } from "react";

import {
  Bot,
  Send,
  User,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import { sendChatMessage } from "../services/api";

function getSessionId() {
  const storageKey = "finland-cyber-session-id";

  let id = sessionStorage.getItem(storageKey);

  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(storageKey, id);
  }

  return id;
}

export default function ChatbotLive({
  setActive,
  isGuest = false,
}) {
  const [sessionId] = useState(getSessionId);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm the Finland Cybersecurity Assistant. How can I help you with cybersecurity today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const suggestions = [
    "What is phishing?",
    "My account has been hacked",
    "How do I report cybercrime in Finland?",
    "What is malware?",
    "How can I protect my personal data?",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(value = input) {
    const message = value.trim();

    if (!message || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const result = await sendChatMessage(
        message,
        sessionId
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            result.reply ||
            "I couldn't find a suitable answer. Please try rephrasing your question.",
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: `I couldn't reach the assistant service: ${error.message}. Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[530px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#111c2e]">

      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-slate-800 p-4">
        <img
          src="/favicon.svg"
          alt=""
          className="h-11 w-11"
        />

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">
            Finland Cybersecurity Assistant
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Dialogflow-powered assistant
          </p>
        </div>

        <span className="hidden rounded-lg border border-slate-700 px-3 py-2 text-[10px] text-slate-400 sm:block">
          INTENT-BASED ASSISTANT
        </span>
      </div>

      {/* Guest information */}
      {isGuest && (
        <div className="border-b border-cyan-400/10 bg-cyan-400/5 px-4 py-3">
          <p className="text-xs text-cyan-300">
            <ShieldCheck
              size={14}
              className="mr-1 inline"
            />
            Guest preview mode — your conversation is for
            demonstration purposes.
          </p>
        </div>
      )}

      {/* Chat messages */}
      <div
        className="flex-1 space-y-5 overflow-y-auto p-4 md:p-6"
        aria-live="polite"
      >
        {messages.map((message, index) => (
          <div
            key={`${index}-${message.role}`}
            className={`flex items-start gap-3 ${
              message.role === "user"
                ? "flex-row-reverse"
                : ""
            }`}
          >
            <div
              className={`rounded-xl p-2 ${
                message.role === "assistant"
                  ? "bg-cyan-400/10 text-cyan-400"
                  : "bg-slate-700 text-white"
              }`}
            >
              {message.role === "assistant" ? (
                <Bot size={18} />
              ) : (
                <User size={18} />
              )}
            </div>

            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === "assistant"
                  ? "rounded-tl-sm bg-slate-800 text-slate-200"
                  : "rounded-tr-sm bg-cyan-500/15 text-cyan-50"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Bot
              size={17}
              className="text-cyan-400"
            />
            Assistant is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions and input */}
      <div className="border-t border-slate-800 p-4">
        <p className="mb-3 text-xs text-slate-500">
          SUGGESTED QUESTIONS
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              disabled={loading}
              onClick={() => sendMessage(item)}
              className="rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300 disabled:opacity-50"
            >
              {item}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0b1525] p-2 focus-within:border-cyan-400/50"
        >
          <input
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Ask about a cybersecurity concern..."
            maxLength={1000}
            disabled={loading}
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-600"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send message"
            className="rounded-lg bg-cyan-400 p-2.5 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </form>

        <p className="mt-3 text-center text-[10px] text-slate-600">
          Guidance is informational and is not a substitute
          for professional incident response.
        </p>

        {!isGuest && (
          <button
            type="button"
            onClick={() => setActive("Report Incident")}
            className="mx-auto mt-2 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
          >
            Need to report an incident?
            <ArrowUpRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
