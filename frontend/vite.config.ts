import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import { defineConfig, loadEnv } from "vite";
import {
  host,
  iiUrl,
  network,
  readCanisterIds,
} from "./scripts/readCanisterIds";

const config: UserConfig = {
  plugins: [sveltekit()],
  build: {
    target: "es2020",
    rollupOptions: {},
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
};

export default defineConfig(({ mode }: UserConfig): UserConfig => {
  // Expand environment - .env files - with canister IDs
  process.env = {
    ...process.env,
    ...loadEnv(mode ?? "development", process.cwd()),
    ...readCanisterIds({ prefix: "VITE_" }),
    VITE_DFX_NETWORK: network,
    VITE_HOST: host,
    VITE_II_URL: iiUrl,
  };

  return {
    ...config,
    // Backwards compatibility for auto generated types of dfx that are meant for webpack and process.env
    define: {
      "process.env": {
        ...readCanisterIds({}),
        DFX_NETWORK: network,
      },
    },
  };
});
