import { NextRequest, NextResponse } from "next/server";
import { LGUAdmins, Workers, Reviews } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, "lgu_admin");
  if (auth instanceof NextResponse) return auth;

  try {
    const { session } = auth;
    const lgu = await LGUAdmins.findByUserId(session.userId as string);
    if (!lgu) return NextResponse.json({ error: "LGU not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const spec   = searchParams.get("specialization") || "All";

    let workers = await Workers.findByLGU(lgu.id);

    if (search) {
      const q = search.toLowerCase();
      workers = workers.filter((w) =>
        w.fullName.toLowerCase().includes(q) || w.specialization.toLowerCase().includes(q)
      );
    }
    if (status !== "all") workers = workers.filter((w) => w.status === status);
    if (spec !== "All")   workers = workers.filter((w) => w.specialization === spec);

    const result = await Promise.all(workers.map(async (w) => {
      const { avg, count } = await Reviews.avgRating(w.id);
      return {
        id: w.id, fullName: w.fullName, specialization: w.specialization,
        municipality: w.municipality, barangay: w.barangay, status: w.status,
        phone: w.phone, email: w.email,
        rating: avg, totalReviews: count,
        joinedAt: new Date(w.createdAt).toLocaleDateString("en-PH", { month:"short", day:"numeric", year:"numeric" }),
      };
    }));

    return NextResponse.json({ workers: result, total: result.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
