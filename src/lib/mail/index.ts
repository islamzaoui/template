import { transporter } from "./transporter";

interface SendOTPEmailParams {
	to: string;
	code: string;
	expirationInMinutes: number;
}

export async function sendOTPEmail({
	to,
	code,
	expirationInMinutes,
}: SendOTPEmailParams) {
	if (!transporter) {
		return console.warn("Mailer is not configured. OTP code:", code);
	}

	const res = await transporter.sendMail({
		from: transporter.options.from,
		to,
		subject: "Your One-Time Password (OTP)",
		text: `Your OTP code is: ${code}. It will expire in ${expirationInMinutes} minutes.`,
	});
	console.log("Email sent:", res);
}
