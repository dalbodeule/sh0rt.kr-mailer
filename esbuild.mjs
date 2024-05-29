import { build } from "esbuild";

import bundlerConfig from "cloudflare-workers-compat/bundler-config";
import { outputReplacesPlugin, aliasPlugin } from "cloudflare-workers-compat/esbuild";

const compatConfig = await bundlerConfig({
  nodeBuiltinModules: true, // replaces node builtins like `assert`, `util`, ...
  nodeGlobals: true, // replaces Node globals like `global`
  workerIncompatibles: true // replaces `eval` and `new Function` with warning functions
});

build({
  bundle: true,
  format: "esm",
  mainFields: ["browser", "module", "main"],
  platform: "neutral",
  target: "es2020",
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/worker.mjs",
  sourcemap: false,
  charset: "utf8",
  minify: process.env.NODE_ENV === "production",
	metafile: true,
  define: compatConfig.define,
  inject: compatConfig.inject,
  plugins: [
    aliasPlugin(compatConfig.aliases),
    outputReplacesPlugin(compatConfig.replaces)
  ],
	external: ['cloudflare:email']
}).catch(err => {
  console.error(err.stack);
});
