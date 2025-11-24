import { createORPCClient, onError } from "@orpc/client";
import { ContractRouterClient } from "@orpc/contract";
import { createSWRUtils } from "@orpc/experimental-react-swr";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import type router from "@/actions";
import contract from "@/generated/contract.json";
import { env } from "@/lib/env";

const link = new OpenAPILink(contract as any, {
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

export const client: JsonifiedClient<ContractRouterClient<typeof router>> =
	createORPCClient(link);

export const orpc = createSWRUtils(client);
