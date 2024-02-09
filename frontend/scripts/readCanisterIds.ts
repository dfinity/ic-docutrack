// npm run dev = local
// npm run build = local
// dfx deploy = local

import { execSync } from "child_process";

// dfx deploy --network ic = ic
export const network = process.env.DFX_NETWORK ?? "local";
export const host =
  process.env.DFX_NETWORK_HOST ??
  (network === "local" ? "http://localhost:8000" : "https://icp0.io");
// Note regarding iiUrl:  On Safari, localhost subdomains are not supported.  If developing with Safari, please use
// II_URL=http://127.0.0.1:8000/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai or similar.
export const iiUrl =
  process.env.II_URL ??
  (network === "local"
    ? "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8000/"
    : "https://identity.ic0.app");

export const readCanisterIds = ({
  prefix,
}: {
  prefix?: string;
}): Record<string, string> => {
  try {
    let canisters = ["frontend", "backend", "internet_identity", "marketing"];
    return canisters.reduce(
      (acc, canisterName) => ({
        ...acc,
        [`${prefix ?? ""}${canisterName.toUpperCase()}_CANISTER_ID`]: execSync(
          `dfx canister id --network ${network} ${canisterName}`
        )
          .toString()
          .trim(),
      }),
      {}
    );
  } catch (e) {
    throw Error(`Could not get canister IDs: ${e}`);
  }
};
