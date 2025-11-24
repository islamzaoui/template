import z from "zod";
import { Role, VehicleType } from "@/generated/prisma/enums";
import { SessionWithUser, UserWithInfo } from "@/lib/auth/types";
import os from "./os";

const userWithInfoSchema = z.object({
	id: z.string(),
	email: z.email(),
	fullname: z.string().nullable(),
	phone: z.string().nullable(),
	role: z.enum(Role).nullable(),
	producer: z
		.object({
			wilayaId: z.number(),
			cityId: z.number(),
			address: z.string(),
			farmerLicenseNumber: z.string(),
		})
		.nullable(),
	transporter: z
		.object({
			licenseNumber: z.string(),
			plateNumber: z.string(),
			vehicleType: z.enum(VehicleType),
			loadCapacityInKg: z.number(),
			vehiclePhoto: z.string().nullable(),
		})
		.nullable(),
	buyer: z.object({}).nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
}) satisfies z.ZodType<UserWithInfo>;

const sessionWithUserSchema = z.object({
	id: z.string(),
	userWithInfo: userWithInfoSchema,
	createdAt: z.date(),
	lastVerifiedAt: z.date(),
}) satisfies z.ZodType<SessionWithUser>;

const getMe = os
	.route({ path: "/", method: "GET" })
	.output(
		z.union([
			z.object({ success: z.literal(false) }),
			z.object({
				success: z.literal(true),
				session: sessionWithUserSchema,
			}),
		]),
	)
	.handler(async ({ context }) => {
		const { sessionWithUser: session } = context;
		if (!session) {
			return { success: false };
		}

		return { success: true, session };
	});

const meActions = os.prefix("/me").router({
	getMe,
});

export default meActions;
