import { NextRequest, NextResponse } from "next/server";
import { LGUAdmins, Workers, Reviews } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, "lgu_admin");
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const { session } = auth;
    const lgu = await LGUAdmins.findByUserId(session.userId as string);
    if (!lgu) return NextResponse.json({ error: "LGU not found" }, { status: 404 });

    const worker = await Workers.findById(id);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    if (worker.lguAdminId !== lgu.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { avg, count } = await Reviews.avgRating(worker.id);
    const allReviews = await Reviews.findByWorker(worker.id);

    const ratingBreakdown = [5,4,3,2,1].map((stars) => ({
      stars, count: allReviews.filter((r) => r.rating === stars).length,
    }));

    return NextResponse.json({
      id: worker.id, fullName: worker.fullName, email: worker.email,
      phone: worker.phone, specialization: worker.specialization,
      municipality: worker.municipality, barangay: worker.barangay,
      province: lgu.province, about: worker.about, status: worker.status,
      lguName: lgu.lguName, rating: avg, totalReviews: count,
      ratingBreakdown,
      joinedAt: new Date(worker.createdAt).toLocaleDateString("en-PH", { month:"long", day:"numeric", year:"numeric" }),
      reviews: allReviews.map((r) => ({
        id: r.id, rating: r.rating, comment: r.comment,
        serviceDate: r.serviceDate, maskedPhone: r.maskedPhone, createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
