import { default as crypto } from "$lib/crypto";
import type { ActorType } from "$lib/shared/actor";
import { enumIs } from "$lib/shared/enums";
import { unreachable } from "$lib/shared/unreachable";
import { writable } from "svelte/store";

type UserState =
  | {
      state: "uninitialized";
    }
  | {
      state: "error";
      error: string;
    }
  | {
      state: "registered";
      firstName: string;
      lastName: string;
    }
  | {
      state: "unregistered";
      registrationState: "idle" | "registering" | "error";
    };

function createUserStore() {
  const { subscribe, set } = writable<UserState>({
    state: "uninitialized",
  });

  return {
    subscribe,
    set,

    register: (firstName: string, lastName: string) => {
      set({
        state: "registered",
        firstName,
        lastName,
      });
    },
    setUnregistered: (registrationState: "idle" | "registering" | "error") => {
      set({
        state: "unregistered",
        registrationState,
      });
    },
    setError: (error: string) => {
      set({
        state: "error",
        error,
      });
    },
    reset: () => set({ state: "uninitialized" }),
  };
}

export const userStore = createUserStore();

export class UserService {
  constructor(private actor: ActorType) {}

  async init() {
    try {
      const response = await this.actor.who_am_i();
      if (enumIs(response, "known_user")) {
        userStore.register(
          response.known_user.first_name,
          response.known_user.last_name
        );
      } else if (enumIs(response, "unknown_user")) {
        userStore.setUnregistered("idle");
      } else {
        unreachable(response);
      }
    } catch (e) {
      userStore.setError("Could not get user info");
    }
  }

  async register(firstName: string, lastName: string) {
    try {
      userStore.setUnregistered("registering");

      await this.actor.set_user(
        firstName,
        lastName,
        new Uint8Array(await crypto.getLocalUserPublicKey())
      );

      userStore.register(firstName, lastName);
    } catch (e) {
      userStore.setUnregistered("error");
    }
  }

  async reset() {
    userStore.reset();
  }
}
