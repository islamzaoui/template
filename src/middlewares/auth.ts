import { COOKIE_NAME } from "@/actions/auth.actions";
import os from "@/actions/os";
import { validateSessionToken } from "@/lib/auth/session";
import { SessionWithUser } from "@/lib/auth/types";

export const authMiddleware = os.middleware(async ({ context, next }) => {
	try {
		const { cookies, headers } = context;

		let session: SessionWithUser | null = null;

		const token =
			cookies.get(COOKIE_NAME)?.value ??
			headers.get("authorization")?.replace("Bearer ", "") ??
			null;
		if (token) {
			const validSession = await validateSessionToken(token);
			if (validSession) {
				session = validSession;
			}
		}

		return next({
			context: {
				sessionWithUser: session,
			},
		});
	} catch (err) {
		console.error("Auth Middleware Error:", err);
		return next({
			context: {
				sessionWithUser: null,
			},
		});
	}
});
