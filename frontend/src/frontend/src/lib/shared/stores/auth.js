import { writable } from "svelte/store";

export const firstName = writable(null);
export const lastName = writable(null);
export const actor = writable(null);
export const authClient = writable(null);
export const isAuthenticated = writable(null);
