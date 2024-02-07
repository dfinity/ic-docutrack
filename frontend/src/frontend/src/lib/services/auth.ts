import { unreachable } from "$lib/shared/unreachable";
import { AuthClient } from "@dfinity/auth-client";
import { derived, get, writable } from "svelte/store";
import { createActor } from "../../../../declarations/backend";
import type { ActorType } from "../shared/actor";
import { FilesService } from "./files";
import { RequestsService } from "./requests";
import { UploadService } from "./upload";
import { UserService } from "./user";

type AuthStateUninitialized = {
  state: "uninitialized";
};

export type AuthStateAuthenticated = {
  state: "authenticated";
  actor: ActorType;
  authClient: AuthClient;
  userService: UserService;
  filesService: FilesService;
  requestService: RequestsService;
  uploadService: UploadService;
};

export type AuthStateUnauthenticated = {
  state: "unauthenticated";
  authClient: AuthClient;
  actor: ActorType;
  uploadService: UploadService;
};

export type AuthState =
  | AuthStateUninitialized
  | AuthStateAuthenticated
  | AuthStateUnauthenticated;

function createAuthStore() {
  const { subscribe, set } = writable<AuthState>({
    state: "uninitialized",
  });

  return {
    subscribe,
    set,
    setLoggedin: (
      actor: ActorType,
      authClient: AuthClient,
      userService: UserService,
      filesService: FilesService,
      requestService: RequestsService,
      uploadService: UploadService
    ) => {
      set({
        state: "authenticated",
        actor,
        authClient,
        userService,
        filesService,
        requestService,
        uploadService,
      });
    },
    setLoggedout: (
      actor: ActorType,
      authClient: AuthClient,
      uploadService: UploadService
    ) => {
      set({
        state: "unauthenticated",
        actor,
        authClient,
        uploadService,
      });
    },
  };
}

export const authStore = createAuthStore();
export const isAuthenticated = derived(
  authStore,
  (store) => store.state === "authenticated"
);

function createServices(actor: ActorType) {
  const userService = new UserService(actor);
  userService.init();
  const filesService = new FilesService(actor);
  const requestsService = new RequestsService(actor);

  const uploadService = new UploadService(actor);

  return {
    userService,
    filesService,
    requestsService,
    uploadService,
  };
}

export class AuthService {
  constructor(
    private canisterId: string,
    private host: string,
    private iiUrl: string
  ) {}

  async init() {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      const actor = createActor(this.canisterId, {
        agentOptions: { host: this.host, identity: authClient.getIdentity() },
      });

      const { userService, filesService, requestsService, uploadService } =
        createServices(actor);

      authStore.setLoggedin(
        actor,
        authClient,
        userService,
        filesService,
        requestsService,
        uploadService
      );
    } else {
      const actor = createActor(this.canisterId, {
        agentOptions: {
          host: this.host,
          identity: authClient.getIdentity(),
        },
      });
      const uploadService = new UploadService(actor);

      authStore.setLoggedout(actor, authClient, uploadService);
    }
  }

  async login() {
    const store = get(authStore);

    if (store.state === "authenticated") {
      return;
    } else if (store.state === "uninitialized") {
      return;
    } else if (store.state === "unauthenticated") {
      try {
        await new Promise<void>((resolve, reject) => {
          store.authClient.login({
            identityProvider: this.iiUrl,
            onSuccess: resolve,
            onError: reject,
          });
        });
        const actor = createActor(this.canisterId, {
          agentOptions: {
            host: this.host,
            identity: store.authClient.getIdentity(),
          },
        });
        const { userService, filesService, requestsService, uploadService } =
          createServices(actor);

        authStore.setLoggedin(
          actor,
          store.authClient,
          userService,
          filesService,
          requestsService,
          uploadService
        );
      } catch (e) {
        const actor = createActor(this.canisterId, {
          agentOptions: {
            host: this.host,
            identity: store.authClient.getIdentity(),
          },
        });
        const uploadService = new UploadService(actor);

        authStore.setLoggedout(actor, store.authClient, uploadService);
      }
    } else {
      unreachable(store);
    }
  }

  async logout() {
    const store = get(authStore);
    if (store.state === "authenticated") {
      try {
        await store.authClient.logout();
        store.userService.reset();
        const actor = createActor(this.canisterId, {
          agentOptions: {
            host: this.host,
            identity: store.authClient.getIdentity(),
          },
        });
        const uploadService = new UploadService(actor);
        authStore.setLoggedout(actor, store.authClient, uploadService);
      } catch (e) {}
    } else if (store.state === "uninitialized") {
      return;
    } else if (store.state === "unauthenticated") {
      return;
    } else {
      unreachable(store);
    }
  }
}

export const authService = new AuthService(
  import.meta.env.VITE_BACKEND_CANISTER_ID,
  import.meta.env.VITE_HOST,
  import.meta.env.VITE_II_URL
);
