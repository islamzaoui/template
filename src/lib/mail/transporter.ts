import { createTransport, Transporter } from "nodemailer";
import { env } from "../env";

let transporter: Transporter | undefined = undefined;

if (
	env.SMTP_HOST &&
	env.SMTP_PORT &&
	env.SMTP_USER &&
	env.SMTP_PASS &&
	env.SMTP_FROM
) {
	transporter = createTransport({
		from: env.SMTP_FROM,
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		secure: env.SMTP_PORT === 465,
		auth: {
			user: env.SMTP_USER,
			pass: env.SMTP_PASS,
		},
		connectionTimeout: 5000,
		socketTimeout: 5000,
		tls:
			env.NODE_ENV === "production"
				? undefined
				: { rejectUnauthorized: false },
	});
}

export { transporter };
