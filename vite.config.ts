import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";
import { remixPWA } from '@remix-pwa/dev'

export default defineConfig({
  plugins: [remix(), remixPWA(), netlifyPlugin(), tsconfigPaths()],
});
