"use server";

import { sessionCookie } from "@/lib/auth/cookie";
import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import requireValidation from "@/lib/helpers/require-validation";
import { mailer } from "@/lib/mailer";
import {
	SendOTP,
	SendOTPSchema,
	VerifyOTP,
	VerifyOTPSchema,
} from "@/lib/schemas/auth.schema";

const VERIFICATION_CODE_EXPIRATION_IN_MINUTES = 10;

function generateOTP() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(data: SendOTP) {
	try {
		const result = requireValidation(SendOTPSchema, data);
		if (!result.success) {
			console.log(result);
			return result;
		}

		const code = generateOTP();
		const expiresAt = new Date(
			Date.now() + VERIFICATION_CODE_EXPIRATION_IN_MINUTES * 60 * 1000,
		);

		const user = await prisma.user.upsert({
			where: { email: result.data.email },
			update: {},
			create: { email: result.data.email },
		});

		const oneTimePassword = await prisma.oneTimePassword.upsert({
			where: { userId: user.id },
			update: { code, expiresAt },
			create: { userId: user.id, code, expiresAt },
		});

		if (mailer) {
			await mailer.sendMail({
				to: result.data.email,
				subject: "Your One-Time Password (OTP)",
				text: `Your OTP code is: ${oneTimePassword.code}. It will expire in ${VERIFICATION_CODE_EXPIRATION_IN_MINUTES} minutes.`,
			});
		} else {
			console.warn("Mailer is not configured. OTP code:", code);
		}

		return { success: true };
	} catch (err) {
		console.error("Error in sendOTP:", err);
		return {
			success: false,
			message: "Failed to send OTP. Please try again later.",
		};
	}
}

export async function verifyOTP(data: VerifyOTP) {
	try {
		const result = requireValidation(VerifyOTPSchema, data);
		if (!result.success) {
			return result;
		}

		const { code, email } = result.data;

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
				message: "Invalid or expired OTP code.",
			};
		}

		void prisma.oneTimePassword.delete({
			where: { id: oneTimePassword.id },
		});

		const session = await createSession(oneTimePassword.userId);
		await sessionCookie.set(session.token);

		return { success: true };
	} catch (err) {
		console.error("Error in verifyOTP:", err);
		return {
			success: false,
			message: "Failed to verify OTP. Please try again later.",
		};
	}
}
