import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory OTP store: mobile → { otp, expires }
const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(req: NextRequest) {
  const { mobile } = await req.json();
  if (!mobile) return NextResponse.json({ error: "Mobile required." }, { status: 400 });

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(mobile, { otp, expires: Date.now() + 5 * 60 * 1000 });

  // In production, send via SMS here (Twilio / MSG91 etc.)
  // For now: return OTP in response so the UI can display it for testing
  return NextResponse.json({ success: true, otp, note: "Dev mode: OTP shown on screen." });
}

export async function PUT(req: NextRequest) {
  const { mobile, otp } = await req.json();
  const record = otpStore.get(mobile);

  if (!record) return NextResponse.json({ valid: false, error: "No OTP requested." }, { status: 400 });
  if (Date.now() > record.expires) {
    otpStore.delete(mobile);
    return NextResponse.json({ valid: false, error: "OTP expired." }, { status: 400 });
  }
  if (record.otp !== otp) return NextResponse.json({ valid: false, error: "Incorrect OTP." }, { status: 400 });

  otpStore.delete(mobile);
  return NextResponse.json({ valid: true });
}
