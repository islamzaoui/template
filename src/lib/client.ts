import { createORPCClient, onError } from "@orpc/client";
import { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import router from "@/actions";
import { env } from "@/lib/env";

const link = new OpenAPILink(router, {
	url: `${env.NEXT_PUBLIC_BASE_URL}/api`,
	fetch: (request, init) => {
		return globalThis.fetch(request, {
			...init,
			credentials: "include",
		});
	},
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

const client: JsonifiedClient<ContractRouterClient<typeof router>> =
	createORPCClient(link);

export default client;
