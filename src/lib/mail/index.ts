import { renderOtpTemplate } from "./templates/otp.template";
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

	let html: string | undefined;
	try {
		html = renderOtpTemplate({ code, expirationInMinutes });
	} catch {}

	await transporter.sendMail({
		from: transporter.options.from,
		to,
		subject: "Your One-Time Password (OTP)",
		text: `Your OTP code is: ${code}. It will expire in ${expirationInMinutes} minutes.`,
		html,
	});
}
