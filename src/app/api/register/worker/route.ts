import { NextRequest, NextResponse } from "next/server";
import { Users, Workers, LGUAdmins } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, specialization, municipality, barangay, about, password } = await req.json();

    if (!fullName || !email || !phone || !specialization || !municipality || !barangay || !password) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    const existing = await Users.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await Users.create({ email, passwordHash, role: "worker" });

    // Assign to first active LGU admin
    const lguAdmins = await LGUAdmins.all();
    const activeLgu = lguAdmins.find((a) => a.status === "active");
    const lguAdminId = activeLgu?.id ?? "unassigned";

    await Workers.create({
      userId: user.id, lguAdminId, fullName,
      email: email.toLowerCase(), phone, specialization,
      municipality, barangay, about: about || "",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
