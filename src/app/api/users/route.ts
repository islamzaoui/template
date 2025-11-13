import { NextRequest } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { SessionWithUser } from "@/lib/auth/session";
import { withAuth } from "@/lib/auth/with-auth";
import { prisma } from "@/lib/db";

function getOrderBy(
	orderBy: string | null,
	order: string | null,
): Prisma.UserOrderByWithRelationInput {
	const sortOrder = order === "asc" ? "asc" : "desc";

	if (!orderBy) {
		return { createdAt: sortOrder };
	}

	if (orderBy.includes(".")) {
		const [relation, field] = orderBy.split(".");
		return {
			[relation]: { [field]: sortOrder },
		} as Prisma.UserOrderByWithRelationInput;
	}

	return { [orderBy]: sortOrder } as Prisma.UserOrderByWithRelationInput;
}

async function handler(req: NextRequest, session: SessionWithUser) {
	const { searchParams } = new URL(req.url);
	const orderByParam = searchParams.get("orderBy");
	const orderParam = searchParams.get("order");
	const search = searchParams.get("search");

	const orderBy = getOrderBy(orderByParam, orderParam);

	const users = await prisma.user.findMany({
		where: search
			? {
					OR: [
						{ email: { contains: search, mode: "insensitive" } },
						{
							userInfo: {
								firstName: {
									contains: search,
									mode: "insensitive",
								},
							},
						},
						{
							userInfo: {
								lastName: {
									contains: search,
									mode: "insensitive",
								},
							},
						},
					],
				}
			: undefined,
		select: {
			id: true,
			email: true,
			createdAt: true,
			userInfo: {
				select: {
					firstName: true,
					lastName: true,
				},
			},
		},
		orderBy,
	});

	return { users };
}

export function GET(req: NextRequest) {
	return withAuth(handler, req);
}
