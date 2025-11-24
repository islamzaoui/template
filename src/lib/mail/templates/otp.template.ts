import { siteName } from "@/lib/config";

type Props = {
	code: string;
	expirationInMinutes: number;
};

const css = `body {
  font-family: Arial, Helvetica, sans-serif;
  background: #f5f7fb;
  margin: 0;
  padding: 0;
}
.container {
  max-width: 600px;
  margin: 32px auto;
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(16, 24, 40, 0.08);
}
.brand {
  font-weight: 700;
  color: #0f172a;
  font-size: 20px;
  margin-bottom: 8px;
}
.lead {
  color: #475569;
  margin-bottom: 20px;
}
.code {
  display: inline-block;
  background: #0f172a;
  color: #fff;
  font-size: 28px;
  letter-spacing: 4px;
  padding: 12px 20px;
  border-radius: 8px;
  margin: 12px 0;
}
.small {
  color: #94a3b8;
  font-size: 13px;
}
.footer {
  margin-top: 20px;
  color: #94a3b8;
  font-size: 12px;
}`;

function escapeHtml(str: string) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export function renderOtpTemplate({
	code,
	expirationInMinutes,
}: Props): string {
	const safeCode = escapeHtml(code);
	const safeMinutes = String(expirationInMinutes);

	const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${siteName} — Your OTP</title>
    <style>${css}</style>
  </head>
  <body>
    <div class="container">
      <div class="brand">${siteName}</div>
      <div class="lead">Use the code below to sign in. This code is valid for <strong>${safeMinutes} minutes</strong>.</div>
      <div class="code">${safeCode}</div>
      <div class="small">If you did not request this code, you can safely ignore this email. Do not share this code with anyone.</div>
      <div class="footer">Thanks — The ${siteName} Team</div>
    </div>
  </body>
</html>`;

	return html;
}

export default renderOtpTemplate;
