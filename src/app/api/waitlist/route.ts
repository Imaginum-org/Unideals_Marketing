import { NextResponse } from "next/server";
import { addContactAndSendWelcome } from "@/lib/brevo";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : undefined;

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
