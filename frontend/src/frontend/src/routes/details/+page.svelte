<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import FilePreview from "$lib/components/FilePreview.svelte";
  import File from "$lib/file";
  import { Buffer } from "buffer";
  import { Alert } from "sveltestrap";
  import Details from "$lib/components/Details.svelte";
  import {
    actor,
    isAuthenticated,
  } from "$lib/shared/stores/auth.js";

  const fileId = parseInt($page.url.searchParams.get("fileId") || "");

  let actorValue;
  let isAuthenticatedValue;;
  let fileNotFound = false;
  let file = {
    name: "",
    dataType: "",
    data: "",
  };
  let permissionError = false;

  actor.subscribe((value) => (actorValue = value));
  isAuthenticated.subscribe((value) => (isAuthenticatedValue = value));

  onMount(async () => {
    if (isAuthenticatedValue) {
      let files = await actorValue.get_requests();
      files.every((entry) => {
        if (entry.file_id == BigInt(fileId)) {
          file.name = entry.file_name;
          return false;
        }
        fileNotFound = true;
        return true;
      });
      if (!fileNotFound){
        let downloadedFile = await actorValue.download_file(fileId);
        permissionError = downloadedFile.permission_error;
        if (!permissionError) {
          let decryptedFile = await File.fromEncrypted(
            file.name,
            downloadedFile.found_file.contents.buffer,
            downloadedFile.found_file.owner_key.buffer
          );
          file.dataType = downloadedFile.found_file.file_type;
          file.data = Buffer.from(decryptedFile.contents).toString("base64");
        }
      }
    }
  });
</script>

<svelte:head>
  <title>DokuTrack: Details</title>
  <meta name="description" content="DokuTrack" />
</svelte:head>
<section>
  <h1>Details</h1>
  {#if isAuthenticated && !permissionError && !fileNotFound}
    <Details {file} />
    {#if file && file.data}
      <h4>File Preview</h4>
      <FilePreview {file} />
    {/if}
  {:else if fileNotFound}
    <h4>File not found</h4>
  {:else}
    <Alert color="warning">
      <h4 class="alert-heading text-capitalize">warning</h4>
      User must be authenticated and authorized.
    </Alert>
  {/if}
</section>
