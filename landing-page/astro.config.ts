import { defineConfig } from "astro/config";
import { host, readCanisterIds } from "../frontend/scripts/readCanisterIds";

const canisterIds = readCanisterIds({});
const hostUrl = new URL(host);

if (hostUrl.port) {
  process.env.PUBLIC_DAPP_URL = `${hostUrl.protocol}//${canisterIds.FRONTEND_CANISTER_ID}.${hostUrl.hostname}:${hostUrl.port}`;
} else {
  process.env.PUBLIC_DAPP_URL = `${hostUrl.protocol}//${canisterIds.FRONTEND_CANISTER_ID}.${hostUrl.hostname}`;
}

// https://astro.build/config
export default defineConfig({});
