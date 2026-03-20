import { NextRequest, NextResponse } from "next/server";
import { Workers, Reviews } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const worker = await Workers.findById(id);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const reviews = await Reviews.findByWorker(id);
    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r.id, rating: r.rating, comment: r.comment,
        serviceDate: r.serviceDate, maskedPhone: r.maskedPhone, createdAt: r.createdAt,
      }))
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
