//ChatbotToggle.tsx
'use client';

import React, { useState, useEffect, useRef } from "react";
import {
  IconMessageCircle,
  IconMail,
  IconBrandWhatsapp,
  IconX,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import LeadCaptureChatbot from "./LeadCaptureChatbot";

export default function ChatbotToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const whatsappLink = "https://wa.me/918954980226";
  const emailLink = "mailto:connectatedm@gmail.com"; // 

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleChatClick = () => {
    setShowMenu(false);
    setIsOpen(true);
  };

  return (
    <>
      {/* Chatbot Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-80 max-w-full z-50 shadow-2xl 
                       rounded-2xl overflow-hidden backdrop-blur-sm bg-[#0A0F1C]/90 
                       border border-[#00B7FF40]"
          >
            <LeadCaptureChatbot onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Contact Menu */}
      <AnimatePresence>
        {showMenu && !isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-28 right-8 z-50 flex flex-col gap-3 p-4 rounded-2xl 
                       bg-gradient-to-br from-[#0A0F1C]/95 to-[#112136]/90 
                       backdrop-blur-xl border border-[#00B7FF40] 
                       shadow-[0_0_25px_rgba(0,183,255,0.25)]"
          >
            {/* WhatsApp */}
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, x: 5 }}
              className="flex items-center gap-2 text-[#25D366] font-medium text-sm transition"
            >
              <IconBrandWhatsapp size={20} /> WhatsApp
            </motion.a>

            {/* Email */}
            <motion.a
              href={emailLink}
              whileHover={{ scale: 1.05, x: 5 }}
              className="flex items-center gap-2 text-cyan-300 font-medium text-sm transition"
            >
              <IconMail size={20} /> Email
            </motion.a>

            {/* Chatbot Button */}
            <motion.button
              onClick={handleChatClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-3 py-2 
                         text-sm font-semibold text-white rounded-xl 
                         bg-gradient-to-r from-[#00B7FF] to-[#0078d7] 
                         shadow-lg hover:brightness-110 transition"
            >
              <IconMessageCircle size={18} /> Chat with EDM Assistant
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Main Chat Button */}
      <motion.button
        onClick={() => {
          if (isOpen) setIsOpen(false);
          else setShowMenu((v) => !v);
        }}
        aria-label={isOpen ? "Close chat" : "Open chat options"}
        animate={{
          boxShadow: [
            "0 0 20px rgba(0,183,255,0.6)",
            "0 0 35px rgba(0,183,255,0.8)",
            "0 0 20px rgba(0,183,255,0.6)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center 
                   w-16 h-16 rounded-full bg-gradient-to-tr from-[#00B7FF] to-[#0088CC] 
                   hover:scale-110 transition-all duration-300 ease-in-out
                   focus:outline-none focus:ring-4 focus:ring-[#00b7ff90]"
        style={{ backdropFilter: "blur(10px)" }}
      >
        {isOpen || showMenu ? <IconX size={28} /> : <IconMessageCircle size={30} />}
      </motion.button>
    </>
  );
}
