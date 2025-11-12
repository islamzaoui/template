import z from "zod";

const email = z.email("Invalid email address");
const code = z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number");


export const SendOTPSchema = z.object({
  email,
})

export type SendOTP = z.infer<typeof SendOTPSchema>;

export const VerifyOTPSchema = z.object({
  email,
  code,
}) 

export type VerifyOTP = z.infer<typeof VerifyOTPSchema>;
