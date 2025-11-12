import { flattenError, ZodType } from "zod";

type validationSuccess<T> = { success: true; data: T };

type ValidationError<T> = {
	success: false;
	issues: {
		[P in keyof T]?: string[] | undefined;
	};
};

type ValidationResult<T> = validationSuccess<T> | ValidationError<T>;

export default function requireValidation<T>(
	schema: ZodType<T>,
	data: unknown,
): ValidationResult<T> {
	const parsed = schema.safeParse(data);
	if (!parsed.success) {
		return {
			success: false,
			issues: flattenError(parsed.error).fieldErrors,
		};
	}

	return {
		success: true,
		data: parsed.data,
	};
}
