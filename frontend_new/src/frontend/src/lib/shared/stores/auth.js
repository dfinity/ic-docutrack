import { writable } from 'svelte/store';
import { AuthClient } from '@dfinity/auth-client';

export const firstName = writable();
export const lastName = writable();
export const actor = writable();
export const authClient = writable();
