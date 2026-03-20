import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Users, LGUAdmins, Workers } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ user: null });

  const user = await Users.findById(session.userId as string);
  if (!user) return NextResponse.json({ user: null });

  if (user.role === "lgu_admin") {
    const admin = await LGUAdmins.findByUserId(user.id);
    if (!admin) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: {
        id: user.id, role: user.role, email: user.email,
        adminId: admin.id, lguName: admin.lguName, adminName: admin.adminName,
        province: admin.province, region: admin.region,
      }
    });
  }

  if (user.role === "worker") {
    const worker = await Workers.findByUserId(user.id);
    if (!worker) return NextResponse.json({ user: null });
    return NextResponse.json({
      user: {
        id: user.id, role: user.role, email: user.email,
        workerId: worker.id, fullName: worker.fullName, status: worker.status,
      }
    });
  }

  return NextResponse.json({ user: null });
}
