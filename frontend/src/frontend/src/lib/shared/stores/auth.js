import { createActor } from "../../../../../declarations/backend";
import { writable } from "svelte/store";

const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
const host = import.meta.env.VITE_HOST;

export const firstName = writable(null);
export const lastName = writable(null);
export const actor = writable(createActor(canisterId, { agentOptions: { host } }));
export const authClient = writable(null);
export const isAuthenticated = writable(null);
