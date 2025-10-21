'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@tabler/icons-react";

/** Strict tuple and type for step */
const chatSteps = [
  "greet",
  "askName",
  "askService",
  "askContact",
  "askEmail",
  "thankYou",
] as const;
type ChatStep = typeof chatSteps[number];

type LeadCaptureChatbotProps = {
  onClose?: () => void;
};

const services = [
  "SEO (Search Engine Optimization)",
  "Social Media Marketing (SMM)",
  "Performance Marketing / Ads",
  "Branding & Design",
  "Website Development",
  "Local SEO",
  "Multiple Services",
] as const;

export default function LeadCaptureChatbot({ onClose }: LeadCaptureChatbotProps) {
  const [step, setStep] = useState<ChatStep>("greet");
  const [name, setName] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");

  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: "👋 Hey there! Welcome to EDM – Era of Digital Marketing." },
    { from: "bot", text: "Can I know your name to get started?" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (from: "bot" | "user", text: string) => {
    setMessages((msgs) => [...msgs, { from, text }]);
  };

  const handleUserInput = (text: string) => {
    addMessage("user", text);

    switch (step) {
      case "greet":
      case "askName":
        setName(text);
        addMessage("bot", `Nice to meet you, ${text}! Which service are you interested in?`);
        setStep("askService");
        break;

      case "askService":
        if ((services as readonly string[]).includes(text)) {
          setService(text);
          addMessage("bot", `Awesome! You’re interested in ${text}. Could you share your contact number?`);
          setStep("askContact");
        } else {
          addMessage("bot", "Please choose a valid service option from below 👇");
        }
        break;

      case "askContact":
        if (/^[6-9]\d{9}$/.test(text.trim())) {
          setContact(text);
          addMessage("bot", `Perfect! Lastly, could you share your email address?`);
          setStep("askEmail");
        } else {
          addMessage("bot", "⚠️ Please enter a valid 10-digit contact number (starting from 6–9).");
        }
        break;

      case "askEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(text.trim())) {
          setEmail(text);
          addMessage("bot", `Thanks, ${name}! Our team will reach out to you soon 🚀`);
          setStep("thankYou");
        } else {
          addMessage("bot", "Please enter a valid email address 📧");
        }
        break;

      case "thankYou":
        // No further input expected
        break;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    handleUserInput(userInput.trim());
    setUserInput("");
  };

  const renderServiceButtons = () => (
    <div className="flex flex-wrap gap-2 mt-3 mb-4 justify-center">
      {services.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => handleUserInput(s)}
          className="
            rounded-full bg-gradient-to-r from-[#00B7FF] to-[#0072FF]
            px-3 py-1.5 text-xs sm:text-sm font-semibold text-white
            shadow-lg hover:brightness-110 transition
          "
        >
          {s}
        </button>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        relative w-full h-[480px]
        flex flex-col overflow-hidden
        rounded-2xl bg-[#0a1120cc]
        backdrop-blur-2xl border border-[#00b7ff40]
        shadow-[0_0_40px_rgba(0,183,255,0.4)]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#00b7ff30] bg-gradient-to-r from-[#001b3a88] to-[#00264f55]">
        <h2 className="font-semibold text-cyan-300 tracking-wide">EDM Chat Assistant 💬</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#00B7FF22] transition"
            aria-label="Close Chat"
          >
            <IconX size={18} className="text-cyan-300" />
          </button>
        )}
      </div>

      {/* Chat Body */}
      <div
        className="flex-1 px-4 py-3 overflow-y-auto space-y-3 
        scrollbar-hide scroll-smooth"
        style={{
          msOverflowStyle: "none", // IE and Edge
          scrollbarWidth: "none",  // Firefox
        }}
      >
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`max-w-[80%] px-4 py-2 text-sm leading-snug rounded-2xl ${
                m.from === "bot"
                  ? "bg-[#002b5e] text-cyan-200 self-start shadow-[0_0_10px_rgba(0,183,255,0.2)]"
                  : "bg-gradient-to-r from-[#007BFF] to-[#00B7FF] text-white self-end ml-auto shadow-lg"
              }`}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[#00b7ff30] bg-[#00142855] px-3 py-3">
        {step === "askService" ? (
          renderServiceButtons()
        ) : step !== "thankYou" ? (
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder={
                step === "askName"
                  ? "Your name"
                  : step === "askContact"
                  ? "Your 10-digit contact number"
                  : step === "askEmail"
                  ? "Your email address"
                  : "Type your message..."
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={step === "thankYou"}
              className="
                flex-grow rounded-xl bg-[#001e3d] text-white
                placeholder:text-[#b9d7ff99]
                px-4 py-2 text-sm border border-[#00B7FF40]
                focus:outline-none focus:ring-2 focus:ring-[#00B7FF]
              "
              aria-disabled={step === "thankYou"}
            />
            <button
              type="submit"
              disabled={step === "thankYou" || !userInput.trim()}
              className="
                px-4 py-2 text-sm font-semibold rounded-xl
                bg-gradient-to-r from-[#00B7FF] to-[#0078d7]
                shadow-lg hover:brightness-110
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              aria-disabled={step === "thankYou" || !userInput.trim()}
            >
              Send
            </button>
          </form>
        ) : (
          <div className="text-center text-cyan-300 font-semibold text-sm">
            🎉 Thank you for contacting us!
          </div>
        )}
      </div>
    </motion.div>
  );
}
