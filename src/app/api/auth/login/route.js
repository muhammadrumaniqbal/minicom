
import { NextResponse } from "next/server";
import {
  verifyCredentials,
  createSessionToken,
  COOKIE_NAME,
  SESSION_DURATION,
} from "@/backend/auth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const role = body.role;
    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (
      !["admin", "customer"].includes(role) ||
      !username ||
      !password ||
      username.length > 100 ||
      password.length > 200
    ) {
      return NextResponse.json(
        { success: false, message: "Enter a valid username and password." },
        { status: 400 }
      );
    }

    if (!verifyCredentials(role, username, password)) {
      return NextResponse.json(
        { success: false, message: "Incorrect username or password." },
        { status: 401 }
      );
    }

    const token = createSessionToken(role, username);
    const response = NextResponse.json({
      success: true,
      role,
      message: "Login successful.",
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to log in. Check your server configuration." },
      { status: 500 }
    );
  }
}
