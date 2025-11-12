import { createTransport, Transporter } from "nodemailer";
import { env } from "./env";

let mailer: Transporter | undefined = undefined;

if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
  mailer = createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  await mailer.verify();
} else {
  console.warn("Mailer is not configured.");
}

export { mailer };
