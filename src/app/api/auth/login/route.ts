import { NextRequest, NextResponse } from "next/server";
import { Users, LGUAdmins, Workers } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await Users.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    let profile: Record<string, unknown> = {};

    if (user.role === "lgu_admin") {
      const admin = await LGUAdmins.findByUserId(user.id);
      if (!admin) return NextResponse.json({ error: "Admin profile not found" }, { status: 404 });
      if (admin.status === "pending") {
        return NextResponse.json({ error: "Your account is pending approval." }, { status: 403 });
      }
      profile = { adminId: admin.id, lguName: admin.lguName, adminName: admin.adminName };
    } else if (user.role === "worker") {
      const worker = await Workers.findByUserId(user.id);
      if (!worker) return NextResponse.json({ error: "Worker profile not found" }, { status: 404 });
      profile = { workerId: worker.id, fullName: worker.fullName, status: worker.status };
    }

    const res = NextResponse.json({ ok: true, role: user.role, ...profile });
    setSessionCookie(res, { userId: user.id, role: user.role, ...profile });
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
