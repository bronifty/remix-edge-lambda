import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["lambda.js"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "lambda.mjs",
  // external: ["express", "node:fs", "node:path", "serverless-http"],
});

console.log("Build complete");
