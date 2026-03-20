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

    const workers = await Workers.findByLGU(lgu.id);
    const allReviews = (await Promise.all(workers.map((w) => Reviews.findByWorker(w.id)))).flat();

    const active   = workers.filter((w) => w.status === "active");
    const pending  = workers.filter((w) => w.status === "pending");
    const inactive = workers.filter((w) => w.status === "inactive");

    // Average rating across all active workers
    const ratedStats = await Promise.all(active.map((w) => Reviews.avgRating(w.id)));
    const ratedWorkers = ratedStats.filter((s) => s.count > 0);
    const avgRating = ratedWorkers.length > 0
      ? Math.round(ratedWorkers.reduce((sum, s) => sum + s.avg, 0) / ratedWorkers.length * 10) / 10
      : 0;

    // Areas covered
    const areaMap: Record<string, { count: number; ratings: number[] }> = {};
    for (let i = 0; i < active.length; i++) {
      const w = active[i];
      if (!areaMap[w.municipality]) areaMap[w.municipality] = { count: 0, ratings: [] };
      areaMap[w.municipality].count++;
      if (ratedStats[i]?.count > 0) areaMap[w.municipality].ratings.push(ratedStats[i].avg);
    }
    const areas = Object.entries(areaMap).map(([name, { count, ratings }]) => ({
      name, workers: count,
      rating: ratings.length > 0 ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10 : 0,
    }));

    // Community metrics
    const uniquePhones = new Set(allReviews.map((r) => r.phoneHash)).size;
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const reviewsThisMonth = allReviews.filter((r) => new Date(r.createdAt) >= monthStart).length;

    // Worker highlights
    const workerStats = await Promise.all(workers.map(async (w) => {
      const { avg, count } = await Reviews.avgRating(w.id);
      return { ...w, avg, reviewCount: count };
    }));
    const withReviews = workerStats.filter((w) => w.reviewCount > 0);
    const mostReviewed  = [...withReviews].sort((a, b) => b.reviewCount - a.reviewCount)[0];
    const highestRated  = [...withReviews].sort((a, b) => b.avg - a.avg)[0];
    const lowestRated   = [...withReviews].sort((a, b) => a.avg - b.avg)[0];

    // Recent activity (last 5 reviews)
    const workerMap = Object.fromEntries(workers.map((w) => [w.id, w]));
    const recentActivity = allReviews
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((r) => {
        const w = workerMap[r.workerId];
        const diff = Math.round((Date.now() - new Date(r.createdAt).getTime()) / 60000);
        const timeAgo = diff < 1 ? "just now" : diff < 60 ? `${diff} min ago` : diff < 1440 ? `${Math.round(diff/60)} hr ago` : `${Math.round(diff/1440)} day(s) ago`;
        return { worker: w?.fullName || "Unknown", workerId: r.workerId, area: w?.municipality || "", time: timeAgo };
      });

    return NextResponse.json({
      lgu: { id: lgu.id, name: lgu.lguName, adminName: lgu.adminName, province: lgu.province },
      stats: { registeredWorkers: workers.length, activeWorkers: active.length, pendingApprovals: pending.length, averageRating: avgRating },
      workerStatus: { active: active.length, pending: pending.length, inactive: inactive.length },
      areas,
      community: {
        totalReviews: allReviews.length, uniqueReviewers: uniquePhones, reviewsThisMonth,
        mostReviewed:  mostReviewed  ? { name: mostReviewed.fullName,  rating: mostReviewed.avg,  reviews: mostReviewed.reviewCount  } : null,
        highestRated:  highestRated  ? { name: highestRated.fullName,  rating: highestRated.avg,  reviews: highestRated.reviewCount  } : null,
        lowestRated:   lowestRated   ? { name: lowestRated.fullName,   rating: lowestRated.avg,   reviews: lowestRated.reviewCount   } : null,
      },
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
