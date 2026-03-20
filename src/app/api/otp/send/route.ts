import { NextRequest, NextResponse } from "next/server";
import { Workers, Reviews, OTPSessions } from "@/lib/db";
import { generateOTP, hashPhone, maskPhone } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { workerId, phone, rating, comment, serviceDate } = await req.json();

    if (!workerId || !phone || !rating || !comment || !serviceDate) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const worker = await Workers.findById(workerId);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    if (worker.status !== "active") {
      return NextResponse.json({ error: "This worker profile is not active" }, { status: 403 });
    }

    const phoneHash = hashPhone(phone);

    // Check duplicate review
    const existing = await Reviews.findByPhoneAndWorker(phoneHash, workerId);
    if (existing) {
      return NextResponse.json({ error: "already_reviewed" }, { status: 409 });
    }

    const code = generateOTP();
    const now = new Date();
    const otpExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);
    const sessionExpiresAt = new Date(now.getTime() + 30 * 60 * 1000);

    await OTPSessions.create({
      workerId,
      phone,
      phoneHash,
      code,
      reviewRating: rating,
      reviewComment: comment,
      reviewServiceDate: serviceDate,
      sessionExpiresAt,
      otpExpiresAt,
    });

    // In production: send real SMS (e.g. Semaphore, Vonage)
    console.log(`\n📱 OTP for ${maskPhone(phone)}: ${code}\n`);

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
