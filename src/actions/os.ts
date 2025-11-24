import { os } from "@orpc/server";
import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { SessionWithUser } from "@/lib/auth/types";

interface Context {
	cookies: ReadonlyRequestCookies;
	headers: ReadonlyHeaders;
	sessionWithUser: SessionWithUser | null;
}

export default os.$context<Context>();
