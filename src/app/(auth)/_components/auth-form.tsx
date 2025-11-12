"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, easeOut, motion as m, stagger } from "motion/react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CircleAlert, Loader2 } from "lucide-react";
import { sendOTP, verifyOTP } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";

const container = {
	hidden: {},
	show: {
		transition: {
			when: "beforeChildren",
			delayChildren: stagger(0.1),
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 10 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: easeOut },
	},
};

export function AuthForm() {
	"use no memo";
	const [step, setStep] = useState(1);
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
	const [otpError, setOtpError] = useState<string | null>(null);
	const router = useRouter();

	const emailForm = useForm<{ email: string }>({
		defaultValues: {
			email: "",
		},
	});

	const onEmailSubmit = async (values: { email: string }) => {
		setIsLoading(true);
		setOtpError(null);
		const result = await sendOTP({ email: values.email });
		if (result.success) {
			setStep(2);
		} else {
			if ("issues" in result && result.issues.email) {
				emailForm.setError("email", {
					type: "manual",
					message: result.issues.email.join(", "),
				});
			} else {
				emailForm.setError("email", {
					type: "manual",
					message: "Failed to send OTP. Please try again.",
				});
			}
		}
		setIsLoading(false);
	};

	const onOtpSubmit = async (otpValue: string) => {
		setIsSubmittingOtp(true);
		setOtpError(null);
		const email = emailForm.getValues("email");
		const result = await verifyOTP({ email, code: otpValue });

		if (result.success) {
			router.push("/");
			router.refresh();
		} else {
			if ("issues" in result && result.issues.code) {
				setOtpError(result.issues.code.join(", "));
			} else {
				setOtpError("Invalid OTP. Please try again.");
			}
			setOtp("");
		}
		setIsSubmittingOtp(false);
	};

	return (
		<m.div
			className="flex flex-col items-center justify-center space-y-4 w-[380px]"
			variants={container}
			initial="hidden"
			animate="show"
		>
			<m.div variants={item} style={{ willChange: "transform, opacity" }}>
				<Image src="/logo.svg" alt="Logo" width={42} height={42} />
			</m.div>
			<AnimatePresence mode="wait">
				{step === 1 && (
					<m.div
						key="email-header"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.4 }}
						className="w-full flex flex-col items-center space-y-2"
					>
						<h1 className="text-xl font-semibold">
							Welcome to App
						</h1>
						<p className="text-base text-muted-foreground">
							Enter your email to continue.
						</p>
					</m.div>
				)}
				{step === 2 && (
					<m.div
						key="otp-header"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.4 }}
						className="w-full flex flex-col items-center space-y-2"
					>
						<h1 className="text-xl font-semibold">
							Check your email
						</h1>
						<p className="text-base text-muted-foreground text-center">
							We&apos;ve sent a 6-character code to{" "}
							<span className="font-semibold text-foreground">
								{emailForm.getValues("email")}
							</span>
							.
						</p>
					</m.div>
				)}
			</AnimatePresence>
			<div className="h-[240px] w-[380px]">
				<AnimatePresence mode="wait">
					{step === 1 && (
						<m.div
							key="email-step"
							exit={{
								opacity: 0,
								y: -10,
								willChange: "transform, opacity",
							}}
							transition={{ duration: 0.4 }}
						>
							<Form {...emailForm}>
								<m.form
									variants={item}
									className="space-y-4 text-center"
									onSubmit={emailForm.handleSubmit(
										onEmailSubmit,
									)}
								>
									<FormField
										control={emailForm.control}
										name="email"
										render={({ field, fieldState }) => (
											<FormItem>
												<FormControl>
													<Input
														placeholder="Email Address"
														{...field}
														inputSize="lg"
														onChange={(e) => {
															field.onChange(e);
															emailForm.clearErrors();
														}}
													/>
												</FormControl>

												<AnimatePresence mode="popLayout">
													{emailForm.formState.errors
														.email?.message && (
														<m.div
															initial={{
																opacity: 0,
																y: 10,
															}}
															animate={{
																opacity: 1,
																y: 0,
															}}
															exit={{
																opacity: 0,
																y: -10,
															}}
															transition={{
																duration: 0.2,
																ease: "easeOut",
															}}
															className="text-destructive ml-1.5 flex items-center gap-1.5 text-left text-sm"
														>
															<CircleAlert
																size={14}
															/>
															<span>
																{
																	emailForm
																		.formState
																		.errors
																		.email
																		.message
																}
															</span>
														</m.div>
													)}
												</AnimatePresence>
											</FormItem>
										)}
									/>
									<Button
										type="submit"
										size="lg"
										className="w-full"
										disabled={isLoading}
										asChild
									>
										<m.button
											className="transition-none"
											layout
											transition={{
												layout: {
													type: "tween",
													ease: "easeInOut",
													duration: 0.2,
												},
											}}
										>
											{isLoading && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Continue
										</m.button>
									</Button>
								</m.form>
							</Form>
						</m.div>
					)}

					{step === 2 && (
						<m.div
							key="otp-step"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							style={{ willChange: "transform, opacity" }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.4 }}
							className="flex flex-col items-center gap-4"
						>
							<div className="space-y-2 w-full flex flex-col items-center justify-center">
								<InputOTP
									maxLength={6}
									value={otp}
									onChange={(value) => {
										setOtp(value);
										if (value.length === 6) {
											onOtpSubmit(value);
										}
									}}
									pattern={REGEXP_ONLY_DIGITS}
									disabled={isSubmittingOtp}
								>
									<InputOTPGroup className="[&>div]:size-12 [&>div]:border-neutral-300">
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
								{otpError && (
									<m.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{
											duration: 0.2,
											ease: "easeOut",
										}}
										className="text-destructive ml-1.5 flex items-center gap-1.5 text-left text-sm"
									>
										<CircleAlert size={14} />

										<span>{otpError}</span>
									</m.div>
								)}
							</div>
							<p className="text-sm text-muted-foreground">
								Didn&apos;t receive the code?{" "}
								<Button
									variant="link"
									size="sm"
									className="px-0 text-sm"
									onClick={() =>
										onEmailSubmit({
											email: emailForm.getValues("email"),
										})
									}
									disabled={isSubmittingOtp || isLoading}
								>
									Resend
								</Button>
							</p>
						</m.div>
					)}
				</AnimatePresence>
			</div>
		</m.div>
	);
}
