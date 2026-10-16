"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Form, Question } from "@/types/form";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  questionId?: string;
}

interface ChatbotWidgetProps {
  form: Form;
  isPreview?: boolean;
  mode?: "fullscreen" | "card" | "embedded";
  onClose?: () => void;
  onSubmitSuccess?: (answers: Record<string, unknown>) => void;
}

export default function ChatbotWidget({
  form,
  isPreview = false,
  mode = "fullscreen",
  onClose,
  onSubmitSuccess,
}: ChatbotWidgetProps) {
  const primaryColor = form?.theme?.primaryColor || "#4f46e5";
  const botName = form?.theme?.botName || "PulseBot";
  const botAvatar = form?.theme?.botAvatar || "✨";
  const sortedQuestions = [...(form?.questions || [])].sort(
    (a, b) => a.order - b.order
  );

  const [messages, setMessages] = useState<Message[]>(() => {
    const msgs: Message[] = [
      {
        id: "msg_welcome",
        sender: "bot",
        text:
          form?.theme?.welcomeMessage ||
          "Hi there! 👋 Welcome to FormPulse. Let's get started!",
        timestamp: "Just now",
      },
    ];
    const sorted = [...(form?.questions || [])].sort((a, b) => a.order - b.order);
    if (sorted.length > 0) {
      msgs.push({
        id: `msg_q_${sorted[0].id}`,
        sender: "bot",
        text: sorted[0].title,
        timestamp: "Just now",
        questionId: sorted[0].id,
      });
    }
    return msgs;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() =>
    (form?.questions || []).length > 0 ? 0 : -1
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalQuestions = sortedQuestions.length;
  const currentQuestion: Question | undefined =
    currentQuestionIndex >= 0 && currentQuestionIndex < totalQuestions
      ? sortedQuestions[currentQuestionIndex]
      : undefined;

  const progressPercent =
    totalQuestions > 0
      ? Math.round(
          (Math.max(0, isCompleted ? totalQuestions : currentQuestionIndex) /
            totalQuestions) *
            100
        )
      : 100;

  // Local container scroll ONLY (does NOT hijack page/window scroll)
  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, validationError, scrollToBottom]);

  // Focus input when moving to a new text/email question
  useEffect(() => {
    if (
      currentQuestion &&
      (currentQuestion.type === "text" || currentQuestion.type === "email") &&
      !isTyping
    ) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, isTyping, currentQuestion]);

  const completeForm = useCallback(
    async (finalAnswers: Record<string, unknown>) => {
      setCurrentQuestionIndex(sortedQuestions.length);
      setIsTyping(true);

      try {
        if (!isPreview) {
          await fetch(`/api/forms/${form.id}/submissions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              answers: finalAnswers,
              metadata: {
                completedAt: new Date().toISOString(),
                userAgent:
                  typeof window !== "undefined" ? navigator.userAgent : "",
              },
            }),
          });
        }

        onSubmitSuccess?.(finalAnswers);
      } catch (err) {
        console.error("Submission failed:", err);
      } finally {
        setIsTyping(false);
        setIsCompleted(true);

        const completionText =
          form.theme.completionMessage ||
          "Thank you! Your response has been securely saved.";

        setMessages((prev) => [
          ...prev,
          {
            id: `msg_complete_${Date.now()}`,
            sender: "bot",
            text: completionText,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        // Fire confetti celebration
        try {
          if (typeof window !== "undefined") {
            const confetti = (await import("canvas-confetti")).default;
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 },
              colors: [primaryColor, "#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
            });
          }
        } catch {
          // Graceful fallback
        }
      }
    },
    [form.id, form.theme.completionMessage, isPreview, onSubmitSuccess, primaryColor, sortedQuestions.length]
  );

  const resetChat = useCallback(() => {
    setAnswers({});
    setIsCompleted(false);
    setValidationError(null);
    setShowSummary(false);
    setCurrentQuestionIndex(sortedQuestions.length > 0 ? 0 : -1);

    const msgs: Message[] = [
      {
        id: `msg_welcome_${Date.now()}`,
        sender: "bot",
        text:
          form.theme.welcomeMessage ||
          "Hi there! 👋 Welcome to FormPulse. Let's get started!",
        timestamp: "Just now",
      },
    ];

    if (sortedQuestions.length > 0) {
      msgs.push({
        id: `msg_q_${sortedQuestions[0].id}_${Date.now()}`,
        sender: "bot",
        text: sortedQuestions[0].title,
        timestamp: "Just now",
        questionId: sortedQuestions[0].id,
      });
    }

    setMessages(msgs);
  }, [form.theme.welcomeMessage, sortedQuestions]);

  const validateAnswer = (
    q: Question,
    val: string | boolean | string[]
  ): string | null => {
    if (q.required) {
      if (
        val === undefined ||
        val === null ||
        (typeof val === "string" && !val.trim())
      ) {
        return "This question is required to continue.";
      }
    }

    if (q.type === "email" && typeof val === "string" && val.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) {
        return "Please enter a valid email address (e.g. name@example.com).";
      }
    }

    return null;
  };

  const handleAnswer = async (value: string | boolean | string[]) => {
    if (!currentQuestion) return;

    const error = validateAnswer(currentQuestion, value);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    // Append user message
    const displayValue =
      typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);

    setMessages((prev) => [
      ...prev,
      {
        id: `msg_user_${Date.now()}`,
        sender: "user",
        text: displayValue,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInputValue("");

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < sortedQuestions.length) {
      const nextQ = sortedQuestions[nextIndex];
      setCurrentQuestionIndex(nextIndex);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_q_${nextQ.id}_${Date.now()}`,
            sender: "bot",
            text: nextQ.title,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            questionId: nextQ.id,
          },
        ]);
      }, 400);
    } else {
      await completeForm(updatedAnswers);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() || !currentQuestion?.required) {
        handleAnswer(inputValue.trim());
      }
    }
  };

  // Determine container classes based on mode
  const containerClasses =
    mode === "fullscreen"
      ? "flex flex-col h-screen max-w-3xl mx-auto bg-white dark:bg-zinc-950 border-x border-zinc-200 dark:border-zinc-800 shadow-xl"
      : mode === "embedded"
      ? "flex flex-col h-[580px] w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
      : "flex flex-col h-[540px] w-full bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {botAvatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm md:text-base leading-tight">
                {botName}
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px] md:max-w-xs">
              {form.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPreview && (
            <span className="text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-md border border-amber-300 dark:border-amber-800">
              Live Preview
            </span>
          )}

          <button
            onClick={resetChat}
            title="Restart conversation"
            className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              title="Close widget"
              className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1">
        <div
          className="h-1 transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: primaryColor,
          }}
        />
      </div>

      {/* Chat Messages List (Container has dedicated ref for non-intrusive scrolling) */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
      >
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${
                isBot ? "justify-start" : "justify-end"
              }`}
            >
              {isBot && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white shrink-0 shadow-xs mb-1"
                  style={{ backgroundColor: primaryColor }}
                >
                  {botAvatar}
                </div>
              )}

              <div
                className={`group relative max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm md:text-[15px] leading-relaxed shadow-xs transition ${
                  isBot
                    ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-bl-xs border border-zinc-200/70 dark:border-zinc-800/80"
                    : "text-white rounded-br-xs shadow-md"
                }`}
                style={
                  !isBot
                    ? { backgroundColor: primaryColor }
                    : undefined
                }
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <div
                  className={`text-[10px] mt-1 text-right select-none ${
                    isBot
                      ? "text-zinc-400 dark:text-zinc-500"
                      : "text-white/70"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isBot && (
                <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-600 dark:text-zinc-300 shrink-0 mb-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Bot Typing Indicator */}
        {isTyping && (
          <div className="flex items-end gap-2.5 justify-start">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white shrink-0 shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              {botAvatar}
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800/80 rounded-2xl rounded-bl-xs px-4 py-3.5 shadow-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: primaryColor,
                    animationDelay: "0ms",
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: primaryColor,
                    animationDelay: "150ms",
                  }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: primaryColor,
                    animationDelay: "300ms",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Completed State Card */}
        {isCompleted && (
          <div className="mt-6 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm md:text-base">
                  Submission Completed
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  All {totalQuestions} questions successfully recorded.
                </p>
              </div>
            </div>

            {/* Answer Summary Toggle */}
            <div>
              <button
                onClick={() => setShowSummary((prev) => !prev)}
                className="flex items-center justify-between w-full text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 py-1.5 border-t border-zinc-200 dark:border-zinc-800 transition"
              >
                <span>{showSummary ? "Hide your answers" : "Review your answers"}</span>
                {showSummary ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showSummary && (
                <div className="mt-3 space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  {sortedQuestions.map((q) => {
                    const ans = answers[q.id];
                    const formatted =
                      typeof ans === "boolean"
                        ? ans
                          ? "Yes"
                          : "No"
                        : ans
                        ? String(ans)
                        : "—";
                    return (
                      <div
                        key={q.id}
                        className="p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800"
                      >
                        <span className="font-medium text-zinc-700 dark:text-zinc-300 block">
                          {q.title}
                        </span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-semibold block mt-0.5">
                          {formatted}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={resetChat}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-200/70 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Submit another response
            </button>
          </div>
        )}
      </main>

      {/* Interactive Answer Input Area */}
      {!isCompleted && currentQuestion && (
        <footer className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm">
          {/* Validation Warning */}
          {validationError && (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Multiple Choice Options */}
          {currentQuestion.type === "multiple_choice" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                <span>Select an option:</span>
                {currentQuestion.required ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Required
                  </span>
                ) : (
                  <span>Optional</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(currentQuestion.options || []).map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-left text-xs md:text-sm font-medium rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition group active:scale-[0.99]"
                  >
                    <span>{opt}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                  </button>
                ))}
              </div>
              {!currentQuestion.required && (
                <button
                  onClick={() => handleAnswer("")}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 mt-2 block"
                >
                  Skip this question →
                </button>
              )}
            </div>
          )}

          {/* Yes / No Options */}
          {currentQuestion.type === "yes_no" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                <span>Choose your answer:</span>
                {currentQuestion.required ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Required
                  </span>
                ) : (
                  <span>Optional</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 font-semibold text-zinc-800 dark:text-zinc-100 text-sm transition active:scale-[0.98]"
                >
                  <span className="text-base">👍</span> Yes
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 font-semibold text-zinc-800 dark:text-zinc-100 text-sm transition active:scale-[0.98]"
                >
                  <span className="text-base">👎</span> No
                </button>
              </div>
              {!currentQuestion.required && (
                <button
                  onClick={() => handleAnswer("")}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 mt-2 block"
                >
                  Skip this question →
                </button>
              )}
            </div>
          )}

          {/* Text & Email Input */}
          {(currentQuestion.type === "text" ||
            currentQuestion.type === "email") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                {currentQuestion.required ? (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Required
                  </span>
                ) : (
                  <span>Optional</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type={currentQuestion.type === "email" ? "email" : "text"}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (validationError) setValidationError(null);
                    }}
                    onKeyDown={handleInputKeyDown}
                    placeholder={
                      currentQuestion.placeholder ||
                      (currentQuestion.type === "email"
                        ? "Enter your email..."
                        : "Type your answer...")
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 transition"
                    style={
                      {
                        "--tw-ring-color": primaryColor,
                      } as React.CSSProperties
                    }
                  />
                </div>

                <button
                  onClick={() => handleAnswer(inputValue.trim())}
                  disabled={
                    currentQuestion.required && !inputValue.trim()
                  }
                  className="p-2.5 rounded-xl text-white font-medium transition shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Press Enter ↵ to send</span>
                {!currentQuestion.required && (
                  <button
                    onClick={() => handleAnswer("")}
                    className="hover:underline text-zinc-500"
                  >
                    Skip question
                  </button>
                )}
              </div>
            </div>
          )}
        </footer>
      )}

      {/* Footer Branding */}
      <div className="py-2 px-4 bg-zinc-100/50 dark:bg-zinc-900/50 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Powered by <strong className="font-semibold text-zinc-600 dark:text-zinc-300">FormPulse</strong>
        </span>
        <span>Secure & encrypted</span>
      </div>
    </div>
  );
}
