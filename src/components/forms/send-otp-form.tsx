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

const sendOtpSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type SendOtpFormValues = z.infer<typeof sendOtpSchema>;

interface SendOtpFormProps {
	onSuccess?: (email: string) => void;
}

export function SendOtpForm({ onSuccess }: SendOtpFormProps) {
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	const form = useForm<SendOtpFormValues>({
		resolver: zodResolver(sendOtpSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(data: SendOtpFormValues) {
		setIsLoading(true);
		setError(null);
		const [err, result] = await safe(client.auth.sendOTP(data));
		if (err) {
			setError(err.message || "Failed to send OTP");
		} else {
			form.reset();
			onSuccess?.(data.email);
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
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email Address</FormLabel>
							<FormControl>
								<Input
									placeholder="you@example.com"
									type="email"
									{...field}
									disabled={isLoading}
								/>
							</FormControl>
							<FormDescription>
								We'll send you a one-time password to this email
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading} className="w-full">
					{isLoading ? "Sending..." : "Send OTP"}
				</Button>
			</form>
		</Form>
	);
}
