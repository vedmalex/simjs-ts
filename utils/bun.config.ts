import { builtinModules } from "module";
import type { BuildConfig } from "bun";

export function createConfig({
	pkg,
	// aliases,
	entrypoints = ["src/index.ts"],
	outdir = "./dist",
	target = "bun",
	format = "esm",
	external = [],
	define = {
		PRODUCTION: JSON.stringify(process.env.NODE_ENV === "production"),
	},
	splitting = true,
	minify,
}: {
	entrypoints?: BuildConfig["entrypoints"];
	outdir?: BuildConfig["outdir"];
	external?: Array<string>;
	define?: BuildConfig["define"];
	target?: BuildConfig["target"];
	splitting?: BuildConfig["splitting"];
	format?: BuildConfig["format"];
	pkg: {
		dependencies?: Record<string, string>;
		peerDependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	};
	minify?: BuildConfig["minify"];
}): BuildConfig {
	const config: BuildConfig = {
		entrypoints,
		target,
		define,
		external: Object.keys(pkg.dependencies || {})
			.concat(Object.keys(pkg.peerDependencies || {}))
			.concat(Object.keys(pkg.devDependencies || {}))
			.concat(builtinModules)
			.concat(external),
		outdir,
		format,
		splitting,
		minify: minify ?? {
			whitespace: false,
			syntax: false,
			identifiers: false,
		},
	};

	// console.log(Bun.inspect(config))
	return config;
}
