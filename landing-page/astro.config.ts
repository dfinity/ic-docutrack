import { defineConfig } from "astro/config";
import { host, readCanisterIds } from "../frontend/scripts/readCanisterIds";

const canisterIds = readCanisterIds({});
const hostUrl = new URL(host);
let siteUrl;
if (hostUrl.port) {
  process.env.PUBLIC_DAPP_URL = `${hostUrl.protocol}//${canisterIds.FRONTEND_CANISTER_ID}.${hostUrl.hostname}:${hostUrl.port}`;
  siteUrl = `${hostUrl.protocol}//${canisterIds.MARKETING_CANISTER_ID}.${hostUrl.hostname}:${hostUrl.port}`;
} else {
  process.env.PUBLIC_DAPP_URL = `${hostUrl.protocol}//${canisterIds.FRONTEND_CANISTER_ID}.${hostUrl.hostname}`;
  siteUrl = `${hostUrl.protocol}//${canisterIds.MARKETING_CANISTER_ID}.${hostUrl.hostname}`;
}

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
});
