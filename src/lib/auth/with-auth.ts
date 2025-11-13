import { NextRequest, NextResponse } from "next/server";
import { sessionCookie } from "./cookie";
import { SessionWithUser, validateSessionToken } from "./session";

export type AuthenticatedHandler<T = any> = (
	req: NextRequest,
	session: SessionWithUser,
) => Promise<T>;

export async function withAuth(
	handler: AuthenticatedHandler,
	req: NextRequest,
): Promise<NextResponse> {
	try {
		// Get session token from cookies
		const token = await sessionCookie.get();

		if (!token) {
			return NextResponse.json(
				{ error: "Unauthorized: No session token provided" },
				{ status: 401 },
			);
		}

		// Validate session token
		const session = await validateSessionToken(token);

		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized: Invalid or expired session" },
				{ status: 401 },
			);
		}

		// Call the handler with the authenticated session
		const response = await handler(req, session);

		// If the handler returns a NextResponse, return it directly
		if (response instanceof NextResponse) {
			return response;
		}

		// Otherwise, wrap the response in a NextResponse
		return NextResponse.json(response, { status: 200 });
	} catch (error) {
		console.error("Authentication error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
