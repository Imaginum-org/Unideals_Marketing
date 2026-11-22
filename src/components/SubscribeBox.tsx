"use client";

import React, { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShareSuccessModal from "./ShareSuccessModal";

// Official Unideals handles (kept in sync with the main app footer + SEO sameAs)
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/unidealsdotin/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.com/invite/j7Zc7e8cD",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/unidealsdotin",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@unidealsdotin",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

// ── Persisted "already joined" state ──────────────────────────────────────────
// Once a visitor joins, we remember it in localStorage so the email field stays
// hidden on reloads / return visits instead of inviting duplicate sign-ups.
const JOINED_KEY = "unideals_waitlist_joined";
const JOINED_EVENT = "unideals:waitlist-joined";

function subscribeJoined(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(JOINED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(JOINED_EVENT, callback);
  };
}

function readJoined(): boolean {
  try {
    return !!window.localStorage.getItem(JOINED_KEY);
  } catch {
    return false;
  }
}

function markJoined(email: string) {
  try {
    window.localStorage.setItem(JOINED_KEY, JSON.stringify({ email, at: Date.now() }));
  } catch {
    // Storage blocked (private mode etc.) — in-memory state still hides the form
  }
  window.dispatchEvent(new Event(JOINED_EVENT));
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SubscribeBox({ isDark }: { isDark: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const storedJoined = useSyncExternalStore(subscribeJoined, readJoined, () => false);

  const isJoined = status === "success" || storedJoined;
  // Fresh sign-up in this session vs. a returning visitor who already joined
  const justJoined = status === "success";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || isJoined) return;

    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus("error");
      setErrorMessage("Please enter a valid university email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      markJoined(trimmed.toLowerCase());
      setStatus("success");
      setShowModal(true);
      setEmail("");
    } catch (err: unknown) {
      const error = err as Error;
      setStatus("error");
      setErrorMessage(error.message || "Could not join waitlist. Please try again.");
    }
  };

  return (
    <div
      className={`unideals-sub-wrap ${isDark ? "is-dark" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <style>{`
        .unideals-sub-wrap {
          margin-top: 8px;
          max-width: 520px;
          width: 100%;
        }
        .unideals-sub-form {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          border-radius: 9999px;
          background: ${isDark ? "#141416" : "#ffffff"};
          border: 1px solid ${isDark ? "rgba(255, 255, 255, 0.09)" : "#e2e8f0"};
          box-shadow: ${
            isDark
              ? "0 2px 6px rgba(0, 0, 0, 0.3), 0 6px 16px -4px rgba(0, 0, 0, 0.4)"
              : "0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 12px -3px rgba(0, 0, 0, 0.04)"
          };
          min-height: 56px;
          padding: 6px;
          box-sizing: border-box;
          transition: border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .unideals-form-inner {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 6px;
        }

        .unideals-input-pill {
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
          width: 100%;
        }

        .unideals-sub-btn {
          padding: 12px 24px;
          font-size: 0.92rem;
          font-family: 'Figtree', sans-serif;
          font-weight: 700;
          border-radius: 9999px;
          border: none;
          background: #3838EC;
          color: #ffffff;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(56, 56, 236, 0.25);
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .unideals-sub-btn:hover:not(:disabled) {
          background: #2d2dd6 !important;
        }
        .unideals-sub-btn:focus-visible {
          outline: 2px solid #3838EC;
          outline-offset: 2px;
        }

        /* ── Mobile Viewports: Vertical Stack for Input & Action Button ── */
        @media (max-width: 520px) {
          .unideals-sub-wrap {
            margin-top: 0 !important;
            margin-bottom: 4px !important;
            padding: 0 4px !important;
          }

          /* When NOT joined, unwrap into a clean vertical stack */
          .unideals-sub-form.is-not-joined {
            display: flex !important;
            flex-direction: column !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            min-height: auto !important;
            overflow: visible !important;
          }

          .unideals-sub-form.is-not-joined .unideals-form-inner {
            flex-direction: column !important;
            gap: 10px !important;
            width: 100% !important;
          }

          /* Email input gets its own dedicated full-width pill */
          .unideals-sub-form.is-not-joined .unideals-input-pill {
            width: 100% !important;
            height: 52px !important;
            border-radius: 9999px !important;
            background: ${isDark ? "#141416" : "#ffffff"} !important;
            border: 1px solid ${
              isDark ? "rgba(255, 255, 255, 0.09)" : "#e2e8f0"
            } !important;
            box-shadow: ${
              isDark
                ? "0 2px 6px rgba(0, 0, 0, 0.3), 0 6px 16px -4px rgba(0, 0, 0, 0.4)"
                : "0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 12px -3px rgba(0, 0, 0, 0.04)"
            } !important;
            padding: 0 16px !important;
            box-sizing: border-box !important;
            transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
          }

          .unideals-sub-form.is-not-joined .unideals-input-pill:focus-within {
            border-color: #3838EC !important;
            box-shadow: 0 0 0 3px rgba(56, 56, 236, 0.15) !important;
          }

          .unideals-sub-input {
            font-size: 1rem !important; /* 16px prevents iOS Safari automatic zoom on focus */
          }

          /* "Get Early Access" becomes a tap-friendly full-width action button */
          .unideals-sub-form.is-not-joined .unideals-sub-btn {
            width: 100% !important;
            height: 48px !important;
            border-radius: 9999px !important;
            font-size: 0.95rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
          }

          /* When joined, keep the compact horizontal confirmed pill */
          .unideals-sub-form.is-joined {
            min-height: 52px !important;
            padding: 6px 10px !important;
          }

          .unideals-confirm-title {
            font-size: 0.86rem !important;
          }
          .unideals-confirm-sub {
            font-size: 0.70rem !important;
          }
          .unideals-social-btn {
            width: 40px !important;
            height: 40px !important;
          }
        }

        /* ── Social buttons: same surface language as the email pill ── */
        .unideals-social-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 14px;
        }
        .unideals-social-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 9999px;
          text-decoration: none;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #565275;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px -6px rgba(16, 7, 43, 0.10);
          transition:
            transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
            background-color 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            box-shadow 0.22s ease;
        }
        .is-dark .unideals-social-btn {
          background: #141416;
          border-color: rgba(255, 255, 255, 0.09);
          color: rgba(255, 255, 255, 0.68);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 8px 20px -6px rgba(0, 0, 0, 0.6);
        }
        .unideals-social-btn:hover,
        .unideals-social-btn:focus-visible {
          transform: translateY(-3px);
          background: #3838EC;
          border-color: #3838EC;
          color: #ffffff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 10px 22px -4px rgba(56, 56, 236, 0.45);
          outline: none;
        }
        .is-dark .unideals-social-btn:hover,
        .is-dark .unideals-social-btn:focus-visible {
          background: #3838EC;
          border-color: #3838EC;
          color: #ffffff;
        }
        .unideals-social-btn:active {
          transform: translateY(-1px) scale(0.96);
        }
        /* Hover tooltip label */
        .unideals-social-btn::after {
          content: attr(data-label);
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translate(-50%, -4px);
          padding: 4px 9px;
          border-radius: 9999px;
          font-family: 'Figtree', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: -0.005em;
          white-space: nowrap;
          background: #10072B;
          color: #ffffff;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .is-dark .unideals-social-btn::after {
          background: #ffffff;
          color: #10072B;
        }
        @media (hover: hover) {
          .unideals-social-btn:hover::after {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        /* Seamless browser autofill fix (prevents Chrome from adding harsh background boxes) */
        .unideals-sub-input:-webkit-autofill,
        .unideals-sub-input:-webkit-autofill:hover,
        .unideals-sub-input:-webkit-autofill:focus,
        .unideals-sub-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          -webkit-text-fill-color: #10072B !important;
          caret-color: #10072B !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        .unideals-sub-input.is-dark:-webkit-autofill,
        .unideals-sub-input.is-dark:-webkit-autofill:hover,
        .unideals-sub-input.is-dark:-webkit-autofill:focus,
        .unideals-sub-input.is-dark:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #141416 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Pill Container (switches between the email input and the joined confirmation) */}
      <motion.form
        onSubmit={handleSubmit}
        noValidate
        animate={status === "error" ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
        className={`unideals-sub-form ${isJoined ? "is-joined" : "is-not-joined"}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isJoined ? (
            /* Joined confirmation — the email field is no longer offered */
            <motion.div
              key="confirmed-pill"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, scale: 0.95, y: 3 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -3 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                minWidth: 0,
                padding: "2px 10px",
              }}
            >
              {/* Brand Blue Check Badge with Pop Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 22, delay: 0.08 }}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "#3838EC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(56, 56, 236, 0.25)",
                }}
              >
                <motion.svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.32, delay: 0.18, ease: "easeOut" }}
                  />
                </motion.svg>
              </motion.div>

              {/* Text feedback */}
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: 0.14 }}
                style={{ display: "flex", flexDirection: "column", minWidth: 0 }}
              >
                <span
                  className="unideals-confirm-title"
                  style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.92rem",
                    letterSpacing: "-0.015em",
                    color: isDark ? "#ffffff" : "#0f172a",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.25,
                  }}
                >
                  You&apos;re on the list!
                </span>
                <span
                  className="unideals-confirm-sub"
                  style={{
                    fontFamily: "'Figtree', sans-serif",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    color: isDark ? "rgba(255, 255, 255, 0.55)" : "#64748b",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.25,
                    marginTop: "1px",
                  }}
                >
                  {justJoined
                    ? "Check your inbox for your confirmation"
                    : "We'll email you the moment we launch"}
                </span>
              </motion.div>

              {/* Share & Invite Button to re-open modal */}
              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={{
                  marginLeft: "auto",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  background: isDark ? "rgba(56, 56, 236, 0.22)" : "rgba(56, 56, 236, 0.1)",
                  border: isDark ? "1px solid rgba(56, 56, 236, 0.35)" : "1px solid rgba(56, 56, 236, 0.22)",
                  color: isDark ? "#A5A4FF" : "#3838EC",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  fontFamily: "'Figtree', sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Share</span>
              </button>
            </motion.div>
          ) : (
            /* Input & Submit Button State */
            <motion.div
              key="input-pill"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="unideals-form-inner"
            >
              {/* Email Input Field Pill */}
              <div className="unideals-input-pill">
                {/* Email Icon */}
                <div
                  aria-hidden="true"
                  style={{
                    paddingLeft: "4px",
                    paddingRight: "8px",
                    color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(16, 7, 43, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>

                {/* Input */}
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-label="Student email address"
                  aria-invalid={status === "error"}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={status === "loading"}
                  placeholder="Enter your student email..."
                  required
                  className={`unideals-sub-input ${isDark ? "is-dark" : ""}`}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "0.96rem",
                    fontFamily: "'Figtree', sans-serif",
                    fontWeight: 500,
                    color: isDark ? "#ffffff" : "#10072B",
                    minWidth: 0,
                    width: "100%",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="unideals-sub-btn"
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {status === "loading" ? "Joining..." : "Get Early Access"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Error feedback if any */}
      <AnimatePresence>
        {status === "error" && !isJoined && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              marginTop: "10px",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#ef4444",
              fontFamily: "'Figtree', sans-serif",
              textAlign: "center",
            }}
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Footnote — switches to a follow prompt once the visitor has joined */}
      <p
        style={{
          marginTop: "14px",
          marginBottom: 0,
          fontSize: "0.78rem",
          fontWeight: 500,
          color: isDark ? "rgba(255, 255, 255, 0.45)" : "#78768e",
          fontFamily: "'Figtree', sans-serif",
          textAlign: "center",
          letterSpacing: "-0.01em",
        }}
      >
        {isJoined
          ? "Follow along for launch updates"
          : "Join students from your campus · No spam ever"}
      </p>

      {/* Official social links */}
      <nav aria-label="Unideals on social media" className="unideals-social-row">
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Unideals on ${item.name}`}
            data-label={item.name}
            className="unideals-social-btn"
          >
            {item.icon}
          </a>
        ))}
      </nav>

      {/* Early Access Share & Confirmation Modal */}
      <ShareSuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isDark={isDark}
      />
    </div>
  );
}
