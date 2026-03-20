import { NextRequest, NextResponse } from "next/server";
import { Workers, Reviews, LGUAdmins } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const worker = await Workers.findById(id);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const lgu = await LGUAdmins.findById(worker.lguAdminId);
    const { avg, count } = await Reviews.avgRating(worker.id);

    return NextResponse.json({
      id: worker.id, fullName: worker.fullName,
      specialization: worker.specialization,
      municipality: worker.municipality, barangay: worker.barangay,
      status: worker.status, lguName: lgu?.lguName || "LGU",
      province: lgu?.province || "", rating: avg, totalReviews: count,
      joinedAt: new Date(worker.createdAt).toLocaleDateString("en-PH", { month:"long", day:"numeric", year:"numeric" }),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req, "lgu_admin");
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!["active", "inactive", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const worker = await Workers.findById(id);
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const { session } = auth;
    const lgu = await LGUAdmins.findByUserId(session.userId as string);
    if (!lgu || worker.lguAdminId !== lgu.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await Workers.update(id, { status });
    return NextResponse.json({ ok: true, worker: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
