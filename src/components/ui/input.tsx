import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
	"file:text-foreground placeholder:text-muted-foreground w-full min-w-0 rounded-xl bg-input px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:font-medium md:text-base",
	{
		variants: {
			inputSize: {
				default: "h-10 file:h-7",
				sm: "h-9 file:h-6 text-sm",
				lg: "h-12 file:h-8 text-lg",
			},
		},
		defaultVariants: {
			inputSize: "default",
		},
	},
);

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, inputSize, ...props }, ref) => {
		return (
			<input
				type={type}
				data-slot="input"
				className={cn(
					inputVariants({ inputSize, className }),
					"focus-visible:ring-primary focus-visible:ring-2",
					"aria-invalid:border aria-invalid:border-destructive aria-invalid:ring-destructive dark:aria-invalid:ring-destructive/40",
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
