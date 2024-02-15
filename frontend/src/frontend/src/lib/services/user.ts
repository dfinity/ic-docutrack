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
      username: string;
    }
  | {
      state: "unregistered";
      registrationState:
        | { state: "idle" }
        | { state: "registering" }
        | {
            state: "error";
            errorMessage: string;
          };
    };

type RegistrationState = Extract<
  UserState,
  { state: "unregistered" }
>["registrationState"];

function createUserStore() {
  const { subscribe, set } = writable<UserState>({
    state: "uninitialized",
  });

  return {
    subscribe,
    set,

    register: (username: string) => {
      set({
        state: "registered",
        username,
      });
    },
    setUnregistered: (registrationState: RegistrationState) => {
      set({
        state: "unregistered",
        registrationState,
      });
    },
    setError: (error: string) => {
      console.log("User store error", error);

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
        userStore.register(response.known_user.username);
      } else if (enumIs(response, "unknown_user")) {
        userStore.setUnregistered({ state: "idle" });
      } else {
        unreachable(response);
      }
    } catch (e) {
      userStore.setError("Could not get user info");
    }
  }

  async register(username: string) {
    try {
      userStore.setUnregistered({ state: "registering" });

      const response = await this.actor.set_user(
        username,
        new Uint8Array(await crypto.getLocalUserPublicKey())
      );

      if (enumIs(response, "username_exists")) {
        userStore.setUnregistered({
          state: "error",
          errorMessage: "Username already exists",
        });
        return;
      }

      userStore.register(username);
    } catch (e: unknown) {
      if (e instanceof Error) {
        userStore.setUnregistered({
          state: "error",
          errorMessage: e.toString(),
        });
      } else {
        userStore.setUnregistered({
          state: "error",
          errorMessage: "Unknown error",
        });
      }
    }
  }

  async reset() {
    userStore.reset();
  }
}
