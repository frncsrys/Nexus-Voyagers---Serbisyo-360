import { NextRequest, NextResponse } from "next/server";
import { Workers, Reviews, OTPSessions } from "@/lib/db";
import { hashPhone, maskPhone } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { workerId, phone, code } = await req.json();

    if (!workerId || !phone || !code) {
      return NextResponse.json({ error: "workerId, phone, and code are required" }, { status: 400 });
    }

    const worker = await Workers.findById(workerId);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const phoneHash = hashPhone(phone);

    // Check duplicate review
    const existing = await Reviews.findByPhoneAndWorker(phoneHash, workerId);
    if (existing) {
      return NextResponse.json({ error: "already_reviewed" }, { status: 409 });
    }

    const session = await OTPSessions.findActive(workerId, phoneHash);
    if (!session) {
      return NextResponse.json({ error: "OTP expired or not found. Please request a new one." }, { status: 400 });
    }

    if (session.code !== code) {
      return NextResponse.json({ error: "Invalid OTP code. Please try again." }, { status: 400 });
    }

    // Check 30-min session window
    if (new Date() > session.sessionExpiresAt) {
      return NextResponse.json({ error: "session_expired" }, { status: 410 });
    }

    // Save review and mark OTP used
    await OTPSessions.markUsed(session.id);

    await Reviews.create({
      workerId,
      rating: session.reviewRating,
      comment: session.reviewComment,
      serviceDate: session.reviewServiceDate,
      phoneHash,
      maskedPhone: maskPhone(phone),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
