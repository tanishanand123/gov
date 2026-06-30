import { NextRequest, NextResponse } from "next/server";
import { createUser, hashPassword, userExists } from "@/lib/users";

export async function POST(req: NextRequest) {
  try {
    const { name, email, mobile, password } = await req.json();

    if (!name || !email || !mobile || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    if (userExists(email, mobile)) {
      return NextResponse.json({ error: "An account with this email or mobile already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = createUser({ name, email, mobile, passwordHash });

    return NextResponse.json({ success: true, id: user.id }, { status: 201 });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
