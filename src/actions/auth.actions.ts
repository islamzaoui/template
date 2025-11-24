import z from "zod";
import { createSession, INACTIVE_TIMEOUT_IN_SECONDS } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { sendOTPEmail } from "@/lib/mail";
import os from "./os";

export const VERIFICATION_CODE_EXPIRATION_IN_MINUTES = 10;
export const COOKIE_NAME = "session_token";

function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOTPAction = os
	.route({ path: "/send-otp", method: "POST" })
	.input(
		z.object({
			email: z.email(),
		}),
	)
	.output(
		z.union([
			z.object({ success: z.literal(true) }),
			z.object({
				success: z.literal(false),
				code: z.literal("INTERNAL_SERVER_ERROR"),
			}),
		]),
	)
	.handler(async ({ input }) => {
		try {
			const { email } = input;

			const user = await prisma.user.upsert({
				where: { email },
				update: {},
				create: { email },
			});

			const oneTimePassword = await prisma.$transaction(async (tx) => {
				await tx.oneTimePassword.deleteMany({
					where: { userId: user.id },
				});

				const code = generateOTP();
				const expiresAt = new Date(
					Date.now() +
						VERIFICATION_CODE_EXPIRATION_IN_MINUTES * 60 * 1000,
				);

				const oneTimePassword = await tx.oneTimePassword.create({
					data: { userId: user.id, code, expiresAt },
				});

				return oneTimePassword;
			});

			await sendOTPEmail({
				to: user.email,
				code: oneTimePassword.code,
				expirationInMinutes: VERIFICATION_CODE_EXPIRATION_IN_MINUTES,
			});

			return { success: true };
		} catch (err) {
			console.error("Error in sendOTP handler:", err);
			return { success: false, code: "INTERNAL_SERVER_ERROR" };
		}
	});

const verifyOTPAction = os
	.route({ path: "/verify-otp", method: "POST" })
	.input(
		z.object({
			email: z.email(),
			code: z.string().length(6),
		}),
	)
	.output(
		z.union([
			z.object({ success: z.literal(true), token: z.string() }),
			z.object({
				success: z.literal(false),
				code: z.union([
					z.literal("INTERNAL_SERVER_ERROR"),
					z.literal("INVALID_OTP"),
				]),
			}),
		]),
	)
	.handler(async ({ context, input }) => {
		try {
			const { email, code } = input;
			const oneTimePassword = await prisma.oneTimePassword.findFirst({
				where: {
					code,
					user: { email },
					expiresAt: { gt: new Date() },
				},
			});

			if (!oneTimePassword) {
				return {
					success: false,
					code: "INVALID_OTP",
				};
			}

			void prisma.oneTimePassword.deleteMany({
				where: { userId: oneTimePassword.userId },
			});

			const session = await createSession(oneTimePassword.userId);

			context.cookies.set("session_token", session.token, {
				name: COOKIE_NAME,
				httpOnly: true,
				maxAge: INACTIVE_TIMEOUT_IN_SECONDS,
				sameSite: "lax",
				secure: env.NODE_ENV === "production",
			});

			return { success: true, token: session.token };
		} catch (err) {
			console.error("Error in verifyOTP handler:", err);
			return { success: false, code: "INTERNAL_SERVER_ERROR" };
		}
	});

const logoutAction = os
	.route({ path: "/logout", method: "GET" })
	.output(z.object({ success: z.literal(true) }))
	.handler(async ({ context }) => {
		context.cookies.delete(COOKIE_NAME);
		return { success: true };
	});

const authActions = os.prefix("/auth").router({
	sendOTP: sendOTPAction,
	verifyOTP: verifyOTPAction,
	logout: logoutAction,
});

export default authActions;
