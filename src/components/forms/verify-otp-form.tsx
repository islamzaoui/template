"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { safe } from "@orpc/client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/client";

interface VerifyOtpFormProps {
	email: string;
	onSuccess?: () => void;
}

const verifyOtpSchema = z.object({
	code: z
		.string()
		.length(6, "OTP must be exactly 6 digits")
		.regex(/^\d+$/, "OTP must contain only numbers"),
});

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;

export function VerifyOtpForm({ email, onSuccess }: VerifyOtpFormProps) {
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const form = useForm<VerifyOtpFormValues>({
		resolver: zodResolver(verifyOtpSchema),
		defaultValues: {
			code: "",
		},
	});

	async function onSubmit(data: VerifyOtpFormValues) {
		setIsLoading(true);
		setError(null);
		const [err, result] = await safe(
			client.auth.verifyOTP({
				email,
				code: data.code,
			}),
		);
		if (err) {
			setError(err.message || "Invalid OTP");
		} else {
			form.reset();
			onSuccess?.();
		}
		setIsLoading(false);
	}

	async function handleRequestNewCode() {
		setIsLoading(true);
		setError(null);
		const [err] = await safe(client.auth.sendOTP({ email }));
		if (err) {
			setError(err.message || "Failed to send OTP");
		}
		setIsLoading(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{error && (
					<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
						{error}
					</div>
				)}

				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>One-Time Password</FormLabel>
							<FormControl>
								<Input
									placeholder="000000"
									type="text"
									inputMode="numeric"
									maxLength={6}
									{...field}
									disabled={isLoading}
									onChange={(e) => {
										const value = e.target.value.replace(
											/\D/g,
											"",
										);
										field.onChange(value);
									}}
								/>
							</FormControl>
							<FormDescription>
								Enter the 6-digit code we sent to your email
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-3">
					<Button
						type="submit"
						disabled={isLoading}
						className="flex-1"
					>
						{isLoading ? "Verifying..." : "Verify OTP"}
					</Button>
					<Button
						type="button"
						variant="outline"
						disabled={isLoading}
						onClick={handleRequestNewCode}
						className="flex-1"
					>
						Request New Code
					</Button>
				</div>
			</form>
		</Form>
	);
}
