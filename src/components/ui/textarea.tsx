import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground w-full min-w-0 rounded-xl bg-input px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:font-medium md:text-base min-h-16 field-sizing-content focus-visible:ring-primary focus-visible:ring-2",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
