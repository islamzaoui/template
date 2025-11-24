import fs from "node:fs";
import { minifyContractRouter } from "@orpc/contract";
import router from "@/actions";

const minifiedRouter = minifyContractRouter(router);

fs.writeFileSync(
	`${process.cwd()}/src/generated/contract.json`,
	JSON.stringify(minifiedRouter),
);
