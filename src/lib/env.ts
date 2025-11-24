import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		DATABASE_URL: z.url(),
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
	},
});
