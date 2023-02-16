import {
  actor,
  authClient,
  firstName,
  isAuthenticated,
  lastName,
} from "$lib/shared/stores/auth.js";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "../../../declarations/backend";

// Tell Sveltekit to not server-side render, otherwise IDB will not work
export const ssr = false;

let first = null;
let last = null;
let backend = null;
let auth = null;
let isAuth = null;

/** @type {import('./$types').PageLoad} */
export async function load() {
  auth = await AuthClient.create();
  isAuth = await auth.isAuthenticated();
  if (isAuth) {
    // Canister IDs are automatically expanded to .env config - see vite.config.ts
    const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
    // We pass the host instead of using a proxy to support NodeJS >= v17 (ViteJS issue: https://github.com/vitejs/vite/issues/4794)
    const host = import.meta.env.VITE_HOST;
    backend = createActor(canisterId, {
      agentOptions: { host, identity: auth.getIdentity() },
    });
    const record = await backend.who_am_i();
    if ("known_user" in record) {
      first = record.known_user.first_name;
      last = record.known_user.last_name;
    }
    actor.set(backend);
    firstName.set(first);
    lastName.set(last);
  }
  authClient.set(auth);
  isAuthenticated.set(isAuth);
}
