import { NextRequest, NextResponse } from "next/server";
import { Workers, Reviews, LGUAdmins } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, "worker");
  if (auth instanceof NextResponse) return auth;

  try {
    const { session } = auth;
    const worker = await Workers.findByUserId(session.userId as string);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const lgu = await LGUAdmins.findById(worker.lguAdminId);
    const { avg, count } = await Reviews.avgRating(worker.id);
    const allReviews = await Reviews.findByWorker(worker.id);

    const ratingBreakdown = [5,4,3,2,1].map((stars) => ({
      stars, count: allReviews.filter((r) => r.rating === stars).length,
    }));

    const recentReviews = allReviews.slice(0, 3).map((r) => ({
      id: r.id, rating: r.rating, comment: r.comment,
      serviceDate: new Date(r.serviceDate).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" }),
    }));

    return NextResponse.json({
      id: worker.id, userId: worker.userId, fullName: worker.fullName,
      email: worker.email, phone: worker.phone,
      specialization: worker.specialization, municipality: worker.municipality,
      barangay: worker.barangay, about: worker.about, status: worker.status,
      lguName: lgu?.lguName || "LGU", province: lgu?.province || "",
      rating: avg, totalReviews: count, ratingBreakdown, recentReviews,
      joinedAt: new Date(worker.createdAt).toLocaleDateString("en-PH", { month:"long", day:"numeric", year:"numeric" }),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req, "worker");
  if (auth instanceof NextResponse) return auth;

  try {
    const { session } = auth;
    const worker = await Workers.findByUserId(session.userId as string);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const { fullName, phone, specialization, municipality, barangay, about } = await req.json();

    const updated = await Workers.update(worker.id, {
      fullName: fullName || worker.fullName,
      phone: phone || worker.phone,
      specialization: specialization || worker.specialization,
      municipality: municipality || worker.municipality,
      barangay: barangay || worker.barangay,
      about: about ?? worker.about,
      status: "pending",
    });

    return NextResponse.json({ ok: true, worker: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
