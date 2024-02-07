<script lang="ts">
  import { beforeNavigate, goto } from "$app/navigation";
  import { page } from "$app/stores";
  import FilePreview from "$lib/components/FilePreview.svelte";
  import type {
    AuthStateAuthenticated,
    AuthStateUnauthenticated,
  } from "$lib/services/auth";
  import { mediaQueryStore } from "$lib/services/media";
  import { ObjectUrlManager } from "$lib/services/objectUrls";
  import {
    UploadService,
    uploadInProgress,
    type UploadType,
  } from "$lib/services/upload";
  import { enumIs } from "$lib/shared/enums";
  import { createTransferSpeedStore } from "$lib/shared/transferSpeed";
  import { unreachable } from "$lib/shared/unreachable";
  import { onDestroy, onMount } from "svelte";
  import {
    fade,
    slide,
    type FadeParams,
    type SlideParams,
  } from "svelte/transition";
  import ErrorMessage from "../ErrorMessage.svelte";
  import FileSelect from "./FileSelect.svelte";
  import UploadProgress from "./UploadProgress.svelte";

  export let auth: AuthStateAuthenticated | AuthStateUnauthenticated;

  let alias: string | null = null;
  let uploadType: UploadType | null = null;
  let state:
    | "initializing"
    | "initialized"
    | "uploading"
    | "uploaded"
    | "error" = "initializing";
  let file: File | null = null;
  let file_id: bigint = 0n;
  let fileName: string = "";
  let dataType: string | null = null;
  let error: string | null = null;
  let fatalError: boolean = false;
  const transferSpeed = createTransferSpeedStore();
  let uploadService: UploadService | null = null;
  const objectUrls = new ObjectUrlManager();

  // tell a global store if an upload is in progress
  $: uploadInProgress.set(state === "uploading");

  let preview: { dataType: string; objectUrl: string } | null = null;

  $: {
    // when Logout is clicked, and we're already initialized for uploading a file for self, then go to the home page
    alias = $page.url.searchParams.get("alias") || "";
    if (!alias && auth.state === "unauthenticated") {
      goto("/");
    }
  }

  onMount(async () => {
    alias = $page.url.searchParams.get("alias") || "";
    if (alias) {
      const aliasInfo = await auth.actor.get_alias_info(alias);

      if (enumIs(aliasInfo, "Ok")) {
        uploadType = {
          type: "request",
          fileInfo: aliasInfo.Ok,
        };
        file_id = aliasInfo.Ok.file_id;
      } else if (enumIs(aliasInfo, "Err")) {
        state = "error";
        if (enumIs(aliasInfo.Err, "not_found")) {
          fatalError = true;
          error = "Request not found or already uploaded";
        } else {
          unreachable(aliasInfo.Err);
        }
        return;
      }
    } else if (auth.state === "authenticated") {
      // upload file for self
      uploadType = {
        type: "self",
        fileName: "",
      };
    } else {
      goto("/");
    }

    state = "initialized";
  });

  onDestroy(() => {
    if (state === "uploading") {
      uploadService?.abort();
      uploadInProgress.set(false);
    }
    objectUrls.clear();
  });

  beforeNavigate((navigation) => {
    if (state === "uploading") {
      if (
        !confirm(
          "You are currently uploading a file. Are you sure you want to leave this page?",
        )
      ) {
        navigation.cancel();
      }
    } else if (navigation.to?.route.id === "/upload") {
      reset();
    }
  });

  function triggerFileSelect() {
    const fileSelector = document.getElementById("file-selector");
    if (fileSelector) {
      fileSelector.click();
    }
  }

  async function handleUpload() {
    uploadService = new UploadService(auth.actor);

    if (uploadType?.type === "self") {
      uploadType.fileName = fileName;
    }

    await uploadService.uploadFile({
      file: file!,
      dataType: dataType!,
      uploadType: uploadType!,
      onAborted() {
        state = "initialized";
      },
      onError: (msg) => {
        console.error(msg);
        state = "error";
        error = msg;
      },
      onCompleted: (fileId) => {
        state = "uploaded";
        file_id = fileId;
      },
      onChunkUploaded: (_chunkId, chunkSize) => {
        transferSpeed.addTransferredBytes(chunkSize);
      },
      onStarted(totalBytes) {
        state = "uploading";
        transferSpeed.start(totalBytes);
      },
    });
  }

  function reset() {
    file = null;
    preview = null;
    fileName = "";
    state = "initialized";
    error = null;
    transferSpeed.reset();
  }

  function onFileChange(newFile: File | null) {
    if (!newFile) {
      preview = null;
      return;
    }
    file = newFile;
    dataType = newFile.type;
    preview = {
      dataType: newFile.type,
      objectUrl: objectUrls.createObjectURLFromBlob(newFile),
    };
  }

  const small = mediaQueryStore("(max-width: 767px)");

  $: slideOutAnimation = {
    axis: "y",
    duration: state === "uploaded" && !$small ? 500 : 0,
    delay: state === "uploaded" && !$small ? 1000 : 0,
  } satisfies SlideParams;

  $: fadeInAnimation = {
    duration: !$small ? 500 : 0,
    delay: !$small ? 1000 : 0,
  } satisfies FadeParams;
</script>

<div class="flex flex-col md:flex-row gap-10">
  <div class="flex-1">
    <div class="flex justify-start items-center gap-7 mb-2">
      {#if state === "uploaded"}
        <h1 class="title-1">File Uploaded Successfully</h1>
      {:else}
        <h1 class="title-1">File Upload</h1>
      {/if}
    </div>

    {#if state === "initialized" || state === "uploading" || (state === "error" && !fatalError)}
      <form
        out:slide={slideOutAnimation}
        class="flex flex-col gap-4 max-w-lg"
        on:submit|preventDefault={handleUpload}
      >
        <FileSelect
          type={uploadType?.type}
          disabled={state === "uploading"}
          bind:fileName
          on:file-selected={(e) => onFileChange(e.detail)}
        />
        {#if state === "initialized" || state === "error"}
          <button class="btn btn-accent" type="submit">Upload file</button>
        {/if}

        {#if state === "uploading"}
          <UploadProgress
            speed={$transferSpeed.speed}
            percent={$transferSpeed.percent}
            total={$transferSpeed.total}
            transferred={$transferSpeed.transferred}
          />
        {/if}
      </form>
    {/if}
    {#if state === "uploaded"}
      <div class="mt-10" in:fade={fadeInAnimation}>
        <div class="flex flex-col gap-3">
          <p class="body-1">
            <strong>File name:</strong>
            {file?.name}
          </p>
          <p class="body-1">
            <strong>File size:</strong>
            {((file?.size || 0) / 1024).toFixed()} KB
          </p>

          <p class="body-1">
            <strong>Upload speed:</strong>
            {($transferSpeed.speed / 1024 / 1024).toFixed(2)} MB/s
          </p>
        </div>

        {#if uploadType?.type === "self"}
          <div class="mt-8 flex gap-6">
            <a href="/details?fileId={file_id}" class="btn btn-accent">
              View your file
            </a>
            <button class="btn btn-ghost" on:click={() => reset()}>
              Upload another file
            </button>
          </div>
        {/if}
      </div>
    {/if}
    {#if state === "error"}
      <ErrorMessage class="mt-10">
        {error}
      </ErrorMessage>
    {/if}
  </div>
  {#if state !== "error" || !fatalError}
    <div class="flex-1">
      {#if preview}
        <FilePreview file={preview}>
          <div
            class="aspect-square w-full flex flex-col gap-3 justify-center items-center bg-silver-700/20 text-center p-10"
          >
            <code>{file?.name}</code>
            <div class="">No preview available</div>
          </div></FilePreview
        >
      {:else}
        <button
          class="w-full aspect-square flex justify-center items-center bg-silver-700/20"
          on:click={triggerFileSelect}
        >
          Select a file
        </button>
      {/if}
    </div>
  {/if}
</div>
