"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ShareSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const SHARE_URL = "https://www.unideals.in";
const SHARE_MESSAGE = `Got something you don't use anymore?

Don't let it sit in your room.
Someone on your campus might actually need it.

Join early access on UniDeals:`;

export default function ShareSuccessModal({
  isOpen,
  onClose,
  isDark,
}: ShareSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${SHARE_MESSAGE}\n${SHARE_URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        if (navigator.canShare) {
          try {
            const res = await fetch("/share.webp");
            const blob = await res.blob();
            const file = new File([blob], "unideals-early-access.webp", {
              type: "image/webp",
            });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: "Unideals - Campus Marketplace",
                text: `${SHARE_MESSAGE}\n${SHARE_URL}`,
                url: SHARE_URL,
                files: [file],
              });
              return;
            }
          } catch {
            // Fall through to standard text/URL share
          }
        }

        await navigator.share({
          title: "UniDeals - Campus Marketplace",
          text: `${SHARE_MESSAGE}\n${SHARE_URL}`,
          url: SHARE_URL,
        });
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Early access confirmation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: isDark
                ? "rgba(5, 5, 8, 0.72)"
                : "rgba(16, 7, 43, 0.4)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="unideals-share-modal"
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxWidth: "590px",
              maxHeight: "92vh",
              overflowY: "auto",
              borderRadius: "24px",
              background: isDark ? "#121217" : "#ffffff",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.09)"
                : "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: isDark
                ? "0 16px 40px rgba(0, 0, 0, 0.6)"
                : "0 12px 36px rgba(16, 7, 43, 0.08)",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "20px",
              gap: "20px",
              boxSizing: "border-box",
            }}
          >
            <style>{`
              @media (max-width: 640px) {
                .unideals-share-modal {
                  flex-direction: column !important;
                  max-width: 380px !important;
                  width: calc(100% - 32px) !important;
                  max-height: 90vh !important;
                  padding: 24px 20px 22px 20px !important;
                  gap: 16px !important;
                  border-radius: 24px !important;
                }
                .unideals-share-img-col {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: auto !important;
                  display: flex !important;
                  justify-content: center !important;
                  align-items: center !important;
                  border: none !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  background: transparent !important;
                }
                .unideals-share-img-col img {
                  width: 100% !important;
                  max-width: 200px !important;
                  height: auto !important;
                  aspect-ratio: 1 / 1 !important;
                  border-radius: 16px !important;
                  object-fit: contain !important;
                  box-shadow: 0 6px 20px -4px rgba(56, 56, 236, 0.22) !important;
                  display: block !important;
                }
                .unideals-share-content-col {
                  padding: 0 !important;
                  width: 100% !important;
                  display: flex !important;
                  flex-direction: column !important;
                }
                .unideals-share-title {
                  font-size: 1.15rem !important;
                  line-height: 1.3 !important;
                  margin-bottom: 6px !important;
                }
                .unideals-share-desc {
                  font-size: 0.86rem !important;
                  line-height: 1.45 !important;
                  margin-bottom: 18px !important;
                }
              }
            `}</style>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close popup"
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                zIndex: 30,
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(16, 7, 43, 0.05)",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(16, 7, 43, 0.08)",
                color: isDark ? "rgba(255, 255, 255, 0.75)" : "#565275",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark
                  ? "rgba(255, 255, 255, 0.16)"
                  : "rgba(16, 7, 43, 0.1)";
                e.currentTarget.style.color = isDark ? "#ffffff" : "#10072B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(16, 7, 43, 0.05)";
                e.currentTarget.style.color = isDark
                  ? "rgba(255, 255, 255, 0.75)"
                  : "#565275";
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Left Column: Image on Desktop, Top on Mobile (Padded Card with Natural 1:1 Aspect) */}
            <div
              className="unideals-share-img-col"
              style={{
                width: "210px",
                height: "210px",
                flexShrink: 0,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                margin: 0,
                background: "transparent",
              }}
            >
              <Image
                src="/share.webp"
                alt="Unideals Early Access"
                width={800}
                height={800}
                priority
                style={{
                  width: "210px",
                  height: "210px",
                  aspectRatio: "1 / 1",
                  objectFit: "contain",
                  borderRadius: "16px",
                  boxShadow: "0 4px 16px -2px rgba(56, 56, 236, 0.22)",
                  display: "block",
                }}
              />
            </div>

            {/* Right Column: Clean, simple content */}
            <div
              className="unideals-share-content-col"
              style={{
                flex: 1,
                padding: "2px 8px 2px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "left",
                minWidth: 0,
              }}
            >
              {/* Title */}
              <h3
                className="unideals-share-title"
                style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  lineHeight: 1.3,
                  letterSpacing: "-0.02em",
                  color: isDark ? "#ffffff" : "#10072B",
                  marginBottom: "8px",
                }}
              >
                You&apos;re on the early access list! 🎉
              </h3>

              {/* Shorter, punchy message */}
              <p
                className="unideals-share-desc"
                style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
                  color: isDark ? "rgba(255, 255, 255, 0.65)" : "#565275",
                  margin: "0 0 20px 0",
                }}
              >
                Spread the word with your campus friends to unlock early access faster.
              </p>

              {/* Action Row: Share button + Circle Copy button side by side */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                }}
              >
                {/* Share Button (no drop shadow, clean solid color) */}
                <button
                  type="button"
                  onClick={handleNativeShare}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    height: "44px",
                    padding: "0 18px",
                    borderRadius: "9999px",
                    background: "#3838EC",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    fontFamily: "'Figtree', sans-serif",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "none",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2d2dd6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#3838EC";
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>Share with Friends</span>
                </button>

                {/* Circular Copy Link Button (side by side with Share) */}
                <button
                  type="button"
                  onClick={copyToClipboard}
                  aria-label={copied ? "Link copied" : "Copy link"}
                  title={copied ? "Copied!" : "Copy link"}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: copied
                      ? isDark
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(16, 185, 129, 0.12)"
                      : isDark
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(16, 7, 43, 0.06)",
                    border: copied
                      ? "1px solid #10B981"
                      : isDark
                      ? "1px solid rgba(255, 255, 255, 0.12)"
                      : "1px solid rgba(16, 7, 43, 0.1)",
                    color: copied
                      ? "#10B981"
                      : isDark
                      ? "#ffffff"
                      : "#10072B",
                    cursor: "pointer",
                    boxShadow: "none",
                    flexShrink: 0,
                    transition: "all 0.18s ease",
                  }}
                >
                  {copied ? (
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
