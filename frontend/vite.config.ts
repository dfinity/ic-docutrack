import { sveltekit } from "@sveltejs/kit/vite";
import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";
import type { UserConfig } from "vite";
import { defineConfig, loadEnv } from "vite";

// npm run dev = local
// npm run build = local
// dfx deploy = local
// dfx deploy --network ic = ic
const network = process.env.DFX_NETWORK ?? "local";
const host = process.env.DFX_NETWORK_HOST ?? ( network === "local" ? "http://localhost:8000" : "https://ic0.app" );
// Note regarding iiUrl:  On Safari, localhost subdomains are not supported.  If developing with Safari, please use
// II_URL=http://127.0.0.1:8000/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai or similar.
const iiUrl = process.env.II_URL ?? ( network === "local" ? "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8000/" : "https://identity.ic0.app" );

const readCanisterIds = ({
  prefix,
}: {
  prefix?: string;
}): Record<string, string> => {
  try {
     let canisters = ["frontend", "backend", "internet_identity"];
     return canisters.reduce((acc, canisterName) => (
       { ...acc,
         [`${prefix ?? ""}${canisterName.toUpperCase()}_CANISTER_ID`]: execSync(`dfx canister id --network ${network} ${canisterName}`).toString().trim()
       }
     ), {})
  } catch (e) {
    throw Error(`Could not get canister IDs: ${e}`);
  }
};

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
