"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";

// ── Types ────────────────────────────────────────────────────────────────────
export interface FeatureCardData {
  id: string;
  imageSrc: string;
  title: string;
  subtitle: string;
}

// ── Mobile Breakpoint Hook ──────────────────────────────────────────────────
function useIsMobile(breakpoint = 820): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
    },
    () => false
  );
}

// ── 9 Feature Cards Data ─────────────────────────────────────────────────────
const ALL_CARDS: FeatureCardData[] = [
  // Row 1
  {
    id: "explore",
    imageSrc: "/features/1f.webp",
    title: "Explore what's selling",
    subtitle: "Everything students are selling, in one place.",
  },
  {
    id: "find",
    imageSrc: "/features/2f.webp",
    title: "Find What You Need",
    subtitle: "Skip the group chats. Find it faster.",
  },
  {
    id: "sell",
    imageSrc: "/features/3f.webp",
    title: "Sell Your Stuff",
    subtitle: "List it once. Reach the right buyer.",
  },

  // Row 2
  {
    id: "chat",
    imageSrc: "/features/4f.webp",
    title: "Chat. Deal. Done.",
    subtitle: "Talk directly, negotiate, ask more and make the deal.",
  },
  {
    id: "verified",
    imageSrc: "/features/5f.webp",
    title: "Verified Students",
    subtitle: "You first trust then you buy, and we know that.",
  },
  {
    id: "campus-first",
    imageSrc: "/features/6f.webp",
    title: "Made for Your Campus",
    subtitle: "Next deal sitting in nearest hostel or the next room.",
  },

  // Row 3
  {
    id: "categories",
    imageSrc: "/features/7f.webp",
    title: "Browse by category",
    subtitle: "Explore from all essential categories for the students.",
  },
  {
    id: "save",
    imageSrc: "/features/8f.webp",
    title: "Save Your Finds",
    subtitle: "Wishlist things you want later. But make a deal before anyone else do",
  },
  {
    id: "deals",
    imageSrc: "/features/9f.webp",
    title: "Student-Friendly Deals",
    subtitle: "Low on cash and need the cheapest price? We've got you covered.",
  },
];

// ── Interactive Row Component ───────────────────────────────────────────────
function FeatureRow({
  cards,
  isDark,
}: {
  cards: FeatureCardData[];
  isDark: boolean;
}) {
  const isMobile = useIsMobile(820);
  // Default expanded is index 1 (the middle card) for desktop
  const [activeCardIndex, setActiveCardIndex] = useState(1);

  return (
    <div
      className="unideals-card-row"
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
        gap: isMobile ? "16px" : "20px",
      }}
    >
      {cards.map((card, idx) => {
        // On mobile, all cards have balanced uniform size (no hover expansion)
        const isExpanded = !isMobile && activeCardIndex === idx;

        return (
          <div
            key={card.id}
            onMouseEnter={() => {
              if (!isMobile) setActiveCardIndex(idx);
            }}
            className={`unideals-feature-card ${isExpanded ? "is-expanded" : "is-collapsed"}`}
            style={{
              flexGrow: isMobile ? 0 : isExpanded ? 1.75 : 0.85,
              flexShrink: isMobile ? 0 : 1,
              flexBasis: isMobile ? "auto" : "0%",
              width: isMobile ? "100%" : "auto",
              minHeight: isMobile ? "auto" : "380px",
              borderRadius: isMobile ? "20px" : "22px",
              background: isDark ? "#121217" : "#ffffff",
              border: isDark
                ? isExpanded
                  ? "1px solid rgba(255, 255, 255, 0.11)"
                  : "1px solid rgba(255, 255, 255, 0.06)"
                : isExpanded
                ? "1px solid rgba(0, 0, 0, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: isExpanded
                ? isDark
                  ? "0 8px 24px -6px rgba(0, 0, 0, 0.45)"
                  : "0 8px 24px -6px rgba(0, 0, 0, 0.04)"
                : isDark
                ? "0 2px 8px rgba(0, 0, 0, 0.2)"
                : "0 1px 3px rgba(0, 0, 0, 0.015)",
              cursor: isMobile ? "default" : "pointer",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: isMobile
                ? "none"
                : "flex-grow 0.5s cubic-bezier(0.2, 0.95, 0.3, 1), border-color 0.25s ease, box-shadow 0.35s ease, background-color 0.3s ease",
            }}
          >
            {/* Upper Visual Area (3D Illustration) */}
            <div
              className="unideals-card-visual"
              style={{
                height: isMobile ? "200px" : "230px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? "18px 16px 6px 16px" : "24px 20px 8px 20px",
                position: "relative",
                overflow: "hidden",
                background: isDark ? "rgba(255, 255, 255, 0.02)" : "transparent",
              }}
            >
              <div
                className="unideals-card-img-wrap"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  borderRadius: isDark ? "14px" : "0",
                  overflow: "hidden",
                  background: isDark ? "#ffffff" : "transparent",
                  padding: isDark ? "8px" : "0",
                  transition: "all 0.3s ease",
                }}
              >
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  width={1536}
                  height={1024}
                  priority={idx < 3}
                  style={{
                    width: "auto",
                    maxWidth: isMobile ? "90%" : isExpanded ? "94%" : "88%",
                    height: "100%",
                    maxHeight: isMobile ? "175px" : isExpanded ? "210px" : "190px",
                    objectFit: "contain",
                    display: "block",
                    transition: isMobile
                      ? "none"
                      : "max-width 0.45s cubic-bezier(0.2, 0.95, 0.3, 1), max-height 0.45s cubic-bezier(0.2, 0.95, 0.3, 1)",
                  }}
                />
              </div>
            </div>

            {/* Bottom Content Area */}
            <div
              className="unideals-card-content"
              style={{
                padding: isMobile ? "14px 20px 22px 20px" : "16px 24px 26px 24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                flex: 1,
                textAlign: "left",
              }}
            >
              <h3
                className="unideals-card-title"
                style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontWeight: 600,
                  fontSize: isMobile ? "1.15rem" : isExpanded ? "1.26rem" : "1.15rem",
                  lineHeight: 1.3,
                  letterSpacing: "-0.02em",
                  color: isDark ? "#ffffff" : "#111827",
                  marginBottom: isMobile ? "6px" : "8px",
                  transition: "font-size 0.3s ease",
                }}
              >
                {card.title}
              </h3>
              <p
                className="unideals-card-subtitle"
                style={{
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: isMobile ? "0.86rem" : "0.88rem",
                  lineHeight: 1.48,
                  color: isDark ? "rgba(255, 255, 255, 0.65)" : "#6B7280",
                  margin: 0,
                }}
              >
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Campus Features Section Component ──────────────────────────────────
export default function CampusFeaturesSection({
  isDark = false,
}: {
  isDark?: boolean;
}) {
  const row1 = ALL_CARDS.slice(0, 3);
  const row2 = ALL_CARDS.slice(3, 6);
  const row3 = ALL_CARDS.slice(6, 9);

  return (
    <section
      id="campus-features"
      style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        padding: "80px 24px 100px 24px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="unideals-features-container"
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Section Heading & Subheading */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "840px",
            margin: "0 auto 36px auto",
          }}
        >
          {/* Eyebrow Pill Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: "9999px",
              background: isDark ? "rgba(56, 56, 236, 0.14)" : "#EEF0FF",
              color: isDark ? "#A5A4FF" : "#5452F6",
              fontSize: "0.84rem",
              fontWeight: 500,
              letterSpacing: "0.01em",
              marginBottom: "18px",
            }}
          >
            Everything you need on campus
          </div>

          {/* Main Title (Reduced boldness: 600 weight) */}
          <h2
            style={{
              fontFamily: "'Figtree', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.9rem, 3.8vw, 2.9rem)",
              lineHeight: 1.25,
              letterSpacing: "-0.025em",
              color: isDark ? "#ffffff" : "#111827",
              margin: "0 auto 16px auto",
              maxWidth: "760px",
            }}
          >
            Buy, sell, discover and connect with<br />students around you.
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: "clamp(0.92rem, 1.6vw, 1.05rem)",
              lineHeight: 1.55,
              color: isDark ? "rgba(255, 255, 255, 0.65)" : "#6B7280",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            Skip the chaotic group chats and spam. A secure campus marketplace built exclusively for verified college students
          </p>
        </div>

        {/* 3x3 Expandable Feature Cards Grid */}
        <FeatureRow cards={row1} isDark={isDark} />
        <FeatureRow cards={row2} isDark={isDark} />
        <FeatureRow cards={row3} isDark={isDark} />
      </div>
    </section>
  );
}
