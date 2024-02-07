import type { ActorType } from "$lib/shared/actor";
import { formatUploadDate, formatUploadDateShort } from "$lib/shared/dates";
import { enumIs } from "$lib/shared/enums";
import { flatten } from "$lib/shared/flatten";
import { unreachable } from "$lib/shared/unreachable";
import { get, writable } from "svelte/store";
import type { file_metadata } from "../../../../declarations/backend/backend.did";

export type UploadedFile = {
  name: string;
  access: string;
  uploadedAt: string;
  uploadedAtShort: string;
  file_id: bigint;
  metadata: file_metadata;
};

export type FilesState =
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
      files: UploadedFile[];
      reloading: boolean;
    };

function createFilesStore() {
  const { subscribe, set } = writable<FilesState>({
    state: "idle",
  });

  return {
    subscribe,
    set,
    setLoaded: (files: UploadedFile[], reloading: boolean) => {
      set({
        state: "loaded",
        files,
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

export const filesStore = createFilesStore();

export class FilesService {
  constructor(private actor: ActorType) {}

  async init() {
    filesStore.setLoading();
    try {
      const files = await this.loadFiles();

      filesStore.setLoaded(files, false);
    } catch (e: unknown) {
      filesStore.setError("Failed to load files");
    }
  }

  async reload() {
    const store = get(filesStore);
    if (store.state === "loading") {
      return;
    } else if (store.state === "loaded") {
      filesStore.setLoaded(store.files, true);
    } else if (store.state === "error" || store.state === "idle") {
      filesStore.setLoading();
    } else {
      unreachable(store);
    }
    try {
      const files = await this.loadFiles();
      filesStore.setLoaded(files, false);
    } catch (e: unknown) {
      filesStore.setError("Failed to load files");
    }
  }

  private async loadFiles(): Promise<UploadedFile[]> {
    const files = flatten(
      await Promise.all([
        this.actor.get_shared_files(),
        this.actor.get_requests(),
      ])
    );

    const uploadedFiles: UploadedFile[] = [];

    for (const file of files) {
      if (enumIs(file.file_status, "uploaded")) {
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
          uploadedAt: formatUploadDate(file.file_status.uploaded.uploaded_at),
          uploadedAtShort: formatUploadDateShort(
            file.file_status.uploaded.uploaded_at
          ),
          file_id: file.file_id,
          metadata: file,
        });
      }
    }

    return uploadedFiles;
  }
}
