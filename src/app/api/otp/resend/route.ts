import { NextRequest, NextResponse } from "next/server";
import { Workers, OTPSessions } from "@/lib/db";
import { generateOTP, hashPhone, maskPhone } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { workerId, phone } = await req.json();

    if (!workerId || !phone) {
      return NextResponse.json({ error: "workerId and phone are required" }, { status: 400 });
    }

    const worker = await Workers.findById(workerId);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const phoneHash = hashPhone(phone);

    // Find latest session to preserve review data and session window
    const latestSession = await OTPSessions.findLatestByWorkerAndPhone(workerId, phoneHash);
    if (!latestSession) {
      return NextResponse.json({ error: "No active session found. Please start over." }, { status: 400 });
    }

    if (new Date() > latestSession.sessionExpiresAt) {
      return NextResponse.json({ error: "session_expired" }, { status: 410 });
    }

    const code = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTPSessions.create({
      workerId,
      phone,
      phoneHash,
      code,
      reviewRating: latestSession.reviewRating,
      reviewComment: latestSession.reviewComment,
      reviewServiceDate: latestSession.reviewServiceDate,
      sessionExpiresAt: latestSession.sessionExpiresAt,
      otpExpiresAt,
    });

    console.log(`\n📱 Resent OTP for ${maskPhone(phone)}: ${code}\n`);

    return NextResponse.json({
      ok: true,
      maskedPhone: maskPhone(phone),
      expiresAt: otpExpiresAt.toISOString(),
      ...(process.env.NODE_ENV !== "production" && { devCode: code }),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
