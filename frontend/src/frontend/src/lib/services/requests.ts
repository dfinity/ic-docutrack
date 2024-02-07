import type { ActorType } from "$lib/shared/actor";
import { formatUploadDate, formatUploadDateShort } from "$lib/shared/dates";
import { enumIs } from "$lib/shared/enums";
import { unreachable } from "$lib/shared/unreachable";
import { get, writable } from "svelte/store";

export type Request = {
  name: string;
  formattedDate: string;
  formattedDateShort: string;
  alias: string;
  access: string;
};

export type RequestsState =
  | {
      state: "idle";
    }
  | {
      state: "loading";
    }
  | {
      state: "error";
      error: string;
    }
  | {
      state: "loaded";
      requests: Request[];
      reloading: boolean;
    };

function createRequestsStore() {
  const { subscribe, set } = writable<RequestsState>({
    state: "idle",
  });

  return {
    subscribe,
    set,
    setLoaded: (requests: Request[], reloading: boolean) => {
      set({
        state: "loaded",
        requests: requests,
        reloading,
      });
    },
    setLoading: () => {
      set({
        state: "loading",
      });
    },
    setError: (error: string) => {
      set({
        state: "error",
        error,
      });
    },
    reset: () => set({ state: "idle" }),
  };
}

export const requestsStore = createRequestsStore();

export class RequestsService {
  constructor(private actor: ActorType) {}

  async init() {
    requestsStore.setLoading();
    try {
      const requests = await this.loadRequests();

      requestsStore.setLoaded(requests, false);
    } catch (e: unknown) {
      requestsStore.setError("Failed to load files");
    }
  }

  async reload() {
    const store = get(requestsStore);
    if (store.state === "loading") {
      return;
    } else if (store.state === "loaded") {
      requestsStore.setLoaded(store.requests, true);
    } else if (store.state === "error" || store.state === "idle") {
      requestsStore.setLoading();
    } else {
      unreachable(store);
    }
    try {
      const files = await this.loadRequests();
      requestsStore.setLoaded(files, false);
    } catch (e: unknown) {
      requestsStore.setError("Failed to load files");
    }
  }

  private async loadRequests(): Promise<Request[]> {
    const requests = await this.actor.get_requests();

    const uploadedFiles: Request[] = [];

    for (const file of requests) {
      if (enumIs(file.file_status, "pending")) {
        // Determine the sharing status
        let nShared = file.shared_with ? file.shared_with.length : 0;
        let accessMessage = "";
        switch (nShared) {
          case 0:
            accessMessage = "Only You";
            break;
          case 1:
            accessMessage = "You & 1 other";
            break;
          default:
            accessMessage = "You & " + nShared + " others";
        }

        uploadedFiles.push({
          name: file.file_name,
          access: accessMessage,
          formattedDate: formatUploadDate(
            file.file_status.pending.requested_at
          ),
          formattedDateShort: formatUploadDateShort(
            file.file_status.pending.requested_at
          ),
          alias: file.file_status.pending.alias,
        });
      }
    }

    return uploadedFiles;
  }
}
