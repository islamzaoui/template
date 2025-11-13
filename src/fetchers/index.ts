class FetchError<T> extends Error {
	info: T;
	status: number;

	constructor(message: string, info: T, status: number) {
		super(message);
		this.info = info;
		this.status = status;
		this.name = "FetchError";
	}
}

export const fetcher = <T>(url: string): Promise<T> =>
	fetch(url).then(async (res) => {
		if (!res.ok) {
			const info = await res.json();
			throw new FetchError(
				"An error occurred while fetching the data.",
				info,
				res.status,
			);
		}
		return res.json();
	});
