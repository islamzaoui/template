"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, easeOut, motion as m, stagger } from "motion/react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CircleAlert, Loader2 } from "lucide-react";

const emailSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
});

const container = {
	hidden: {},
	show: {
		transition: {
			when: "beforeChildren",
			delayChildren: stagger(0.05),
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 10 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.2, ease: easeOut },
	},
};

export function AuthForm() {
	'use no memo';
	const [step, setStep] = useState(1);
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);

	const emailForm = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			email: "",
		},
		reValidateMode: 'onSubmit'
	});

	const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
		setIsLoading(true); // Set loading state for email submission
		console.log("Email submitted:", values.email);
		await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
		setStep(2);
		setIsLoading(false); // Reset loading state
	};

	const onOtpSubmit = async (otpValue: string) => {
		setIsSubmittingOtp(true);
		console.log("OTP submitted:", otpValue);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		alert("OTP Verified (simulated)");
		setIsSubmittingOtp(false);
	};

	useEffect(() => {
		console.log(emailForm.formState.errors);
	})
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
						transition={{ duration: 0.2 }}
						className="w-full flex flex-col items-center space-y-2"
					>
						<h1 className="text-xl font-semibold">Welcome to App</h1>
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
						transition={{ duration: 0.2 }}
						className="w-full flex flex-col items-center space-y-2"
					>
						<h1 className="text-xl font-semibold">Check your email</h1>
						<p className="text-base text-muted-foreground">
							We&apos;ve sent a 6-character code to your email.
						</p>
					</m.div>
				)}
			</AnimatePresence>
			<div className="h-[240px] w-[380px]">
				<AnimatePresence mode="wait">
					{step === 1 && (
						<m.div
							key="email-step"
							exit={{ opacity: 0, y: -10, willChange: "transform, opacity" }}
							transition={{ duration: 0.2 }}
						>
							<Form {...emailForm}>
								<m.form
									variants={item}
									className="space-y-4 text-center"
									onSubmit={emailForm.handleSubmit(onEmailSubmit)}
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
															field.onChange(e)
															emailForm.clearErrors()
														}}
													/>
												</FormControl>

												<AnimatePresence mode="popLayout">
													{emailForm.formState.errors.email?.message && (
														<m.div
															initial={{ opacity: 0, y: 10 }}
															animate={{ opacity: 1, y: 0 }}
															exit={{ opacity: 0, y: -10 }}
															transition={{ duration: 0.2, ease: "easeOut" }}
															className="text-destructive ml-1.5 flex items-center gap-1.5 text-left text-sm"
														>
															<CircleAlert size={14} />
															<span>{emailForm.formState.errors.email.message}</span>
														</m.div>
													)}
												</AnimatePresence>
											</FormItem>
										)}
									/>
									<Button type="submit" size="lg" className="w-full" disabled={isLoading} asChild>
										<m.button
											className="transition-none"
											layout
											transition={{
												layout: {
													type: 'tween',
													ease: 'easeInOut',
													duration: 0.2,
												},
											}}
										>
											{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
							transition={{ duration: 0.2 }}
							className="flex flex-col items-center gap-4"
						>
							<div className="space-y-4 w-full flex items-center justify-center">
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
							</div>
							<p className="text-sm text-muted-foreground">
								Didn&apos;t receive the code?{" "}
								<Button
									variant="link"
									size="sm"
									className="px-0 text-sm"
									onClick={() => setStep(1)}
									disabled={isSubmittingOtp}
								>
									Resend
								</Button>
							</p>
						</m.div>
					)}
				</AnimatePresence>
			</div>
		</m.div >
	);
}
