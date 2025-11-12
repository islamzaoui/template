import { sessionCookie } from "@/lib/auth/cookie";
import { validateSessionToken } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
	const token = await sessionCookie.get();

	if (!token) {
		return NextResponse.json({ isLoggedIn: false });
	}

	const session = await validateSessionToken(token);

	if (session) {
		return NextResponse.json({ isLoggedIn: true, user: session.user });
	}

	return NextResponse.json({ isLoggedIn: false });
}
