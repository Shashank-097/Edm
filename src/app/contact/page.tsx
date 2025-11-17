'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Mail, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';

// Extend window for reCAPTCHA
declare global {
  interface Window {
    grecaptcha?: {
      execute: (key: string, options: { action: string }) => Promise<string>;
    };
  }
}

// Environment vars
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const CONTACT_SECRET = process.env.NEXT_PUBLIC_CONTACT_SECRET || '';
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

interface Particle {
  top: number;
  left: number;
  size: number;
  delay: number;
}

interface FormPayload {
  mobile: string;
  name: string;
  email: string;
  message: string;
  source: string;
  secret: string;
  recaptcha?: string;
}

interface ApiResponse {
  ok?: boolean;
  error?: string;
  message?: string;
}

export default function ContactPage() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reCAPTCHA script
  useEffect(() => {
    if (RECAPTCHA_SITE_KEY && !document.querySelector('#recaptcha-script')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Mouse / particles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const generated: Particle[] = Array.from({ length: 20 }, () => ({
      top: Math.random() * window.innerHeight,
      left: Math.random() * window.innerWidth,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(generated);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const icons = [
    { icon: <Mail size={28} />, top: 60, left: 40 },
    { icon: <Phone size={28} />, top: 250, left: 60 },
    { icon: <MessageCircle size={28} />, top: 150, left: 260 },
  ];

  const calculateOffset = (iconTop: number, iconLeft: number) => {
    const dx = iconLeft - cursorPos.x;
    const dy = iconTop - cursorPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = Math.min(100 / (dist + 1), 20);
    return { x: (dx / dist) * force, y: (dy / dist) * force };
  };

  // Handle form submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      const form = e.currentTarget;
      const fd = new FormData(form);

      const mobile = (fd.get('mobile') || '').toString().trim();
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();

      const payload: FormPayload = {
        mobile,
        name,
        email,
        message,
        source: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        secret: CONTACT_SECRET,
      };

      if (!payload.mobile || !payload.email || !payload.message || !payload.name) {
        setError('Please fill all fields.');
        setSubmitting(false);
        return;
      }

      // Get reCAPTCHA token
      let token = '';
      if (window.grecaptcha && RECAPTCHA_SITE_KEY) {
        try {
          token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
        } catch (recapErr) {
          console.warn('reCAPTCHA execute failed', recapErr);
        }
      }
      payload.recaptcha = token;

      // Send to backend
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const j: ApiResponse = await res.json().catch(() => ({}));

      console.log('Response from server:', j);

      if (!res.ok || !j.ok) {
        const serverMsg = j?.error || j?.message || `Status ${res.status}`;
        setError(`Failed to send: ${serverMsg}`);
        setSubmitting(false);
        return;
      }

      // Success UI
      setSubmitted(true);
      form.reset();
    } catch (err) {
      console.error('Contact submit failed', err);
      setError('Failed to send — try again later.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1B2738] text-white relative overflow-hidden">
      <main className="flex-grow flex items-center justify-center p-6 relative">
        {/* Floating circles */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-[#00B7FF]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-[#FF6B6B]/20 rounded-full blur-3xl animate-pulse" />

        {/* Drifting particles */}
        {particles.map((p, idx) => (
          <motion.div
            key={idx}
            className="absolute bg-white rounded-full opacity-20"
            style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{
              repeat: Infinity,
              duration: 6 + Math.random() * 4,
              delay: p.delay,
            }}
          />
        ))}

        {/* Floating icons */}
        {icons.map((icon, idx) => {
          const offset = calculateOffset(icon.top, icon.left);
          return (
            <motion.div
              key={idx}
              style={{
                position: 'absolute',
                top: icon.top,
                left: icon.left,
                x: offset.x,
                y: offset.y,
              }}
              className="text-[#00B7FF]/70"
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              {icon.icon}
            </motion.div>
          );
        })}

        {/* Contact card */}
        <motion.section
          className="max-w-md w-full bg-[#112136]/90 rounded-3xl p-10 shadow-2xl backdrop-blur-md border border-[#00B7FF]/20 z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {!submitted ? (
            <>
              <h1 className="text-center text-4xl font-extrabold text-[#00B7FF] mb-4 animate-pulse">
                Contact Us
              </h1>
              <p className="text-center text-gray-400 mb-4">
                Email us:{' '}
                <a href="mailto:connectatedm@gmail.com" className="text-[#00B7FF] hover:underline">
                  connectatedm@gmail.com
                </a>
              </p>

              {error && (
                <div className="mb-4 rounded-md bg-[#FF4D4F]/10 border border-[#FF4D4F]/30 p-3 text-sm text-[#FFCCCC]">
                  {error}
                </div>
              )}

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <label className="flex flex-col">
                  <span className="mb-2 font-semibold text-gray-400">Full Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    required
                    autoComplete="off"
                    className="rounded-lg bg-[#0A0F1C] border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00B7FF] focus:ring-1 focus:ring-[#00B7FF] transition-all"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 font-semibold text-gray-400">Mobile Number</span>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Your mobile number"
                    required
                    autoComplete="off"
                    className="rounded-lg bg-[#0A0F1C] border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00B7FF] focus:ring-1 focus:ring-[#00B7FF] transition-all"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 font-semibold text-gray-400">Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    required
                    autoComplete="off"
                    className="rounded-lg bg-[#0A0F1C] border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00B7FF] focus:ring-1 focus:ring-[#00B7FF] transition-all"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="mb-2 font-semibold text-gray-400">Message</span>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Write your message here"
                    required
                    className="resize-none rounded-lg bg-[#0A0F1C] border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#00B7FF] focus:ring-1 focus:ring-[#00B7FF] transition-all"
                  />
                </label>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 w-full rounded-full bg-[#00B7FF] py-3 font-semibold text-white shadow-lg hover:bg-[#0077cc] hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: submitting ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>

              <p className="text-center text-gray-400 text-xs mt-4">
                Protected by reCAPTCHA • Google Privacy Policy &amp; Terms apply
              </p>
            </>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center text-center space-y-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <CheckCircle2 size={64} className="text-[#00B7FF] animate-bounce" />
              <h2 className="text-3xl font-bold text-[#00B7FF]">Thank You!</h2>
              <p className="text-gray-300">
                Your message has been sent successfully. <br />
                Our team will get back to you shortly.
              </p>
              <motion.button
                onClick={() => {
                  setSubmitted(false);
                  setError(null);
                }}
                className="mt-4 rounded-full bg-[#00B7FF] px-6 py-2 font-semibold text-white shadow-md hover:bg-[#0077cc] hover:scale-105 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Another Message
              </motion.button>
            </motion.div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
