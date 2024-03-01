import pkg from "./package.json" assert { type: "json" };
import { createConfig } from "./utils/bun.config";

// Create a Bun config from package.json
await Bun.build(
	createConfig({
		pkg,
		target: "browser",
		outdir: "browser",
		minify: false,
	}),
);

await Bun.build(
	createConfig({
		pkg,
		target: "node",
		outdir: "node",
		minify: true,
	}),
);

