import { cookies } from "next/headers";
import { INACTIVE_TIMEOUT_IN_SECONDS, SessionWithToken } from "./session";
import { env } from "../env";

const COOKIE_NAME = "session_token";

async function getSessionCookie() {
	const c = await cookies();
	return c.get(COOKIE_NAME)?.value;
}

async function setSessionCookie(token: string) {
	const c = await cookies();
	c.set({
		name: COOKIE_NAME,
		value: token,
		httpOnly: true,
		maxAge: INACTIVE_TIMEOUT_IN_SECONDS,
		sameSite: "lax",
		secure: env.NODE_ENV === "production",
	});
}

async function deleteSessionCookie() {
	const c = await cookies();
	c.delete(COOKIE_NAME);
}

export const sessionCookie = {
	get: getSessionCookie,
	set: setSessionCookie,
	delete: deleteSessionCookie,
};
