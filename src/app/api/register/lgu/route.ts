import { NextRequest, NextResponse } from "next/server";
import { Users, LGUAdmins } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { lguName, province, region, adminName, email, officeContact, address, password } = await req.json();

    if (!lguName || !province || !region || !adminName || !email || !password) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    const existing = await Users.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await Users.create({ email, passwordHash, role: "lgu_admin" });

    await LGUAdmins.create({
      userId: user.id, lguName, province, region,
      adminName, email: email.toLowerCase(),
      officeContact: officeContact || "", address: address || "",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
