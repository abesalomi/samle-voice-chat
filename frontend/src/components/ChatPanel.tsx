import { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "../types";
import { sendTextMessage, sendVoiceMessage } from "../api";
import VoiceRecorder from "./VoiceRecorder";
import "./ChatPanel.css";

interface Props {
  sessionId: string;
  onBookingMade: () => void;
}

export default function ChatPanel({ sessionId, onBookingMade }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Sawasdee! Welcome to Thailand Tour Booking! I'm your AI assistant and I can help you discover and book amazing tours across Thailand. You can type or use voice chat. What kind of adventure are you looking for?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (
    role: "user" | "assistant",
    content: string,
    isVoice = false,
    transcribedText?: string
  ) => {
    const msg: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      timestamp: new Date(),
      isVoice,
      transcribedText,
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const handleSendText = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    addMessage("user", text);
    setIsLoading(true);

    try {
      const data = await sendTextMessage(text, sessionId);
      addMessage("assistant", data.response);
      if (
        data.response.toLowerCase().includes("booking") &&
        data.response.toLowerCase().includes("confirmed")
      ) {
        onBookingMade();
      }
    } catch {
      addMessage(
        "assistant",
        "Sorry, I encountered an error. Please make sure the backend is running and GEMINI_API_KEY is set."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceResult = async (audioBase64: string) => {
    setIsLoading(true);
    addMessage("user", "Sending voice message...", true);

    try {
      const data = await sendVoiceMessage(audioBase64, sessionId);
      // Update the user's voice message with transcription
      setMessages((prev) => {
        const updated = [...prev];
        const lastUserMsg = [...updated]
          .reverse()
          .find((m) => m.role === "user" && m.isVoice);
        if (lastUserMsg) {
          lastUserMsg.content = data.transcribed_text || "Voice message";
          lastUserMsg.transcribedText = data.transcribed_text;
        }
        return updated;
      });
      addMessage("assistant", data.response);
      if (
        data.response.toLowerCase().includes("booking") &&
        data.response.toLowerCase().includes("confirmed")
      ) {
        onBookingMade();
      }
    } catch {
      addMessage(
        "assistant",
        "Sorry, I couldn't process the voice message. Please try again or type your message."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split("\n")
      .map((line, i) => {
        // Bold
        line = line.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>"
        );
        // Bullet points
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return `<li key=${i}>${line.slice(2)}</li>`;
        }
        return line;
      })
      .join("<br/>");
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-icon">💬</div>
        <div>
          <h2>Tour Booking Assistant</h2>
          <span className="chat-subtitle">
            Voice & Text Chat powered by Gemini
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === "assistant" ? "🤖" : "👤"}
            </div>
            <div className="message-bubble">
              {msg.isVoice && (
                <span className="voice-badge">🎤 Voice</span>
              )}
              <div
                className="message-content"
                dangerouslySetInnerHTML={{
                  __html: formatMessage(msg.content),
                }}
              />
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <VoiceRecorder onResult={handleVoiceResult} disabled={isLoading} />
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or use voice..."
          disabled={isLoading}
        />
        <button
          className="send-button"
          onClick={handleSendText}
          disabled={!input.trim() || isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
