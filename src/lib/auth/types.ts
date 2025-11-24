import type {
	BuyerInfo,
	ProducerInfo,
	Role,
	Session,
	TransporterInfo,
	User,
} from "@/generated/prisma/client";

export interface UserWithInfo extends User {
	role: Role | null;
	producer: Omit<ProducerInfo, "id"> | null;
	transporter: Omit<TransporterInfo, "id"> | null;
	buyer: Omit<BuyerInfo, "id"> | null;
}

export interface SessionWithToken extends Session {
	token: string;
}

export interface SessionWithUser
	extends Omit<Session, "userId" | "secretHash"> {
	userWithInfo: UserWithInfo;
}

export type { Session, User };
