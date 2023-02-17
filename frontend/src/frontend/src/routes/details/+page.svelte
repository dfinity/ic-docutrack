<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import FilePreview from "$lib/components/FilePreview.svelte";
  import File from "$lib/file";
  import { Alert } from "sveltestrap";
  import Details from "$lib/components/Details.svelte";
  import {
    actor,
    isAuthenticated,
  } from "$lib/shared/stores/auth.js";
  import { arrayBufferToBase64 } from "$lib/buffer";

  const fileId = parseInt($page.url.searchParams.get("fileId") || "");

  let actorValue;
  let isAuthenticatedValue;;
  let fileNotFound = false;
  let download = "";
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
      files = files.concat(await actorValue.get_shared_files());
      console.log(files);
      files.every((entry) => {
        if (entry.file_id == BigInt(fileId)) {
          fileNotFound = false;
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
          file.data = arrayBufferToBase64( decryptedFile.contents);
          download = `data:${file.dataType};base64,${file.data}`
        }
      }
    }
  });
</script>

<svelte:head>
  <title>DocuTrack: Details</title>
  <meta name="description" content="DocuTrack" />
</svelte:head>
<section>
  <h1>Details</h1>
  {#if isAuthenticated && !permissionError && !fileNotFound}
    <Details {file} />
    {#if file && file.data}
      <h4>File Preview</h4>
      <a class="btn btn-primary" href={download} download={file.name}>Download</a>
      <p></p>
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
