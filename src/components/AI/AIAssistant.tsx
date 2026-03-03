import { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  User,
  Loader,
  Sparkles,
  Zap,
  RotateCcw,
} from "lucide-react";
import { aiAPI, tasksAPI, goalsAPI } from "../../services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your LifeOS AI, powered by Groq. I can help you prioritize tasks, brainstorm goals, or analyze your productivity trends. What's on your mind?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const runAudit = async () => {
    const action = localStorage.getItem("ai_action");
    if (action === "run_audit") {
      localStorage.removeItem("ai_action");
      setLoading(true);
      try {
        const [tasks, goals] = await Promise.all([
          tasksAPI.getAll(),
          goalsAPI.getAll(),
        ]);

        const insights = await aiAPI.getInsights(tasks, goals);

        // 🚀 THE FIX: Check if insights is a valid array
        const isArray = Array.isArray(insights);

        const contentText = isArray
          ? insights
              .map((i: any) => `• **${i.title}**: ${i.description}`)
              .join("\n\n")
          : typeof insights === "string"
            ? insights
            : "I couldn't generate specific insights at this time.";

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `📊 **Productivity Audit Ready**\n\n${contentText}`,
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await aiAPI.chat(messageText);
      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting to my brain (the API). Please check your connection and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    {
      label: "Prioritize Today",
      icon: <Zap size={14} />,
      text: "Help me prioritize my tasks for today",
    },
    {
      label: "Goal Planning",
      icon: <Sparkles size={14} />,
      text: "Suggest a 3-step plan for a new fitness goal",
    },
    {
      label: "Time Tips",
      icon: <Bot size={14} />,
      text: "Give me 3 tips for better time management",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-4 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight dark:text-white">
              LifeOS Intelligence
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                System Online • Groq LPU™
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
          title="Reset Chat"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 md:gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center shadow-sm 
                ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"}`}
              >
                {msg.role === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>

              <div
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[85%] md:max-w-[75%]`}
              >
                <div
                  className={`p-4 rounded-[24px] text-sm md:text-base leading-relaxed shadow-sm
                  ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Loader size={18} className="animate-spin text-blue-500" />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-3xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Quick Prompts Wrapper */}
        <div className="p-4 md:p-6 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
          {/* Quick Prompts - Only show at start */}
          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 transition-all active:scale-95"
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          )}

          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), handleSend())
              }
              placeholder="Ask LifeOS to analyze your productivity..."
              className="w-full pl-4 pr-14 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white resize-none shadow-inner"
              rows={2}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="absolute right-3 bottom-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-blue-500/20 active:scale-90"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
