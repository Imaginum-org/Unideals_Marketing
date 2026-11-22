import { NextResponse } from "next/server";
import { addContactAndSendWelcome } from "@/lib/brevo";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Lightweight IP-based in-memory rate limiter to prevent bot floods/abuse
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 6;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Periodic cleanup of expired entries (keeps memory minimal)
  if (rateLimitMap.size > 2000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    // Bot honeypot check (if automated bots fill unseen fields)
    const honey = body as Record<string, unknown>;
    if (honey.website || honey.phone || honey.url || honey.comment) {
      return NextResponse.json(
        { error: "Submission could not be processed." },
        { status: 400 }
      );
    }

    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : undefined;

    if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid university email address." },
        { status: 400 }
      );
    }

    const result = await addContactAndSendWelcome({
      email,
      name: name || undefined,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    // Log the real cause server-side, but never leak provider errors to the client
    console.error("[Waitlist API Error]", err);
    return NextResponse.json(
      { error: "Could not join the waitlist right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
