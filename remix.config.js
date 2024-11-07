/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  publicPath: "/build/",
  tailwind: true,
  postcss: true,
  watchPaths: ["./tailwind.config.ts"],
};