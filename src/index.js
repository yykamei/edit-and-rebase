import * as core from "@actions/core";
import { main } from "./main";

try {
	await main();
} catch (error) {
	core.setFailed(error.message);
}
