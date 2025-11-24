import { prisma } from "@/lib/db";
import { Session, SessionWithToken, SessionWithUser } from "./types";

export const INACTIVE_TIMEOUT_IN_SECONDS = 60 * 60 * 24 * 7;
export const ACTIVITY_CHECK_INTERVAL_IN_SECONDS = 60 * 60;

async function hashSecret(secret: string): Promise<Uint8Array<ArrayBuffer>> {
	const secretBytes = new TextEncoder().encode(secret);
	const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
	return new Uint8Array(secretHashBuffer);
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}

function createId(): string {
	const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);
	let id = "";
	for (let i = 0; i < bytes.length; i++) {
		id += alphabet[bytes[i] >> 3];
	}
	return id;
}

export async function createSession(userId: string): Promise<SessionWithToken> {
	const sessionId = createId();
	const secret = createId();
	const secretHash = await hashSecret(secret);
	const token = `${sessionId}.${secret}`;

	const session = await prisma.session.create({
		data: {
			id: sessionId,
			userId,
			secretHash,
		},
	});

	return { ...session, token };
}

export async function deleteSessionById(sessionId: string) {
	await prisma.session.deleteMany({
		where: { id: sessionId },
	});
}

export async function getSessionById(
	sessionId: string,
): Promise<Session | null> {
	const now = new Date();

	const existingSession = await prisma.session.findUnique({
		where: { id: sessionId },
	});
	if (!existingSession) {
		return null;
	}

	if (
		now.getDate() - existingSession.createdAt.getTime() >=
		INACTIVE_TIMEOUT_IN_SECONDS * 1000
	) {
		await deleteSessionById(existingSession.id);
		return null;
	}

	return existingSession;
}

export async function validateSessionToken(
	token: string,
): Promise<SessionWithUser | null> {
	const now = new Date();

	const tokenParts = token.split(".");
	if (tokenParts.length !== 2) {
		return null;
	}

	const sessionId = tokenParts[0];
	const sessionSecret = tokenParts[1];
	const session = await getSessionById(sessionId);

	if (!session) {
		return null;
	}

	const secretHash = await hashSecret(sessionSecret);
	if (!constantTimeEqual(secretHash, session.secretHash)) {
		return null;
	}

	if (
		now.getDate() - session.lastVerifiedAt.getTime() >=
		ACTIVITY_CHECK_INTERVAL_IN_SECONDS * 1000
	) {
		session.lastVerifiedAt = now;
		await prisma.session.update({
			where: { id: session.id },
			data: { lastVerifiedAt: now },
		});
	}

	const user: SessionWithUser["userWithInfo"] | null =
		await prisma.user.findUnique({
			where: { id: session.userId },
			include: {
				producer: {
					omit: {
						id: true,
					},
				},
				transporter: {
					omit: {
						id: true,
					},
				},
				buyer: {
					omit: {
						// id: true, commnted until buyer model have data
					},
				},
			},
		});

	if (!user) {
		return null;
	}

	return {
		id: session.id,
		userWithInfo: user,
		createdAt: session.createdAt,
		lastVerifiedAt: session.lastVerifiedAt,
	};
}
