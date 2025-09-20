import pluginDts from "./plugin-generate-dts";

await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",
  root: ".",
  plugins: [pluginDts],
});
