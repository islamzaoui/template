"use client";

import * as React from "react";
import { SendOtpForm } from "@/components/forms/send-otp-form";
import { VerifyOtpForm } from "@/components/forms/verify-otp-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type AuthStep = "send-otp" | "verify-otp";

export default function AuthPage() {
	const [step, setStep] = React.useState<AuthStep>("send-otp");
	const [email, setEmail] = React.useState<string>("");

	const handleOtpSent = (emailAddress: string) => {
		setEmail(emailAddress);
		setStep("verify-otp");
	};

	const handleOtpVerified = () => {
		// Redirect to dashboard or home page after successful verification
		// For now, just reset to send-otp
		setStep("send-otp");
		setEmail("");
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-2xl">Sign in</CardTitle>
					<CardDescription>
						{step === "send-otp"
							? "Enter your email to receive a one-time password"
							: "Enter the verification code sent to your email"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{step === "send-otp" ? (
						<SendOtpForm onSuccess={handleOtpSent} />
					) : (
						<VerifyOtpForm
							email={email}
							onSuccess={handleOtpVerified}
						/>
					)}

					{step === "verify-otp" && (
						<div className="mt-6 text-center">
							<button
								onClick={() => setStep("send-otp")}
								className="text-sm text-primary hover:underline"
							>
								Use a different email
							</button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
