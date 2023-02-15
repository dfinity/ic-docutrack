<script>
  import { page } from "$app/stores";
  import { actor, authClient } from "$lib/shared/stores/auth.js";
  import { createActor } from "../../../../declarations/backend";
  import { AuthClient } from "@dfinity/auth-client";
  import { onMount } from "svelte";
  import FilePreview from "$lib/components/FilePreview.svelte";
  import File from "$lib/file";
  import { default as crypto } from "$lib/crypto";
  import { Alert } from "sveltestrap";
  import Details from "$lib/components/Details.svelte";

  const fileId = parseInt($page.url.searchParams.get("fileId") || "");

  let actorValue;
  let authClientValue;
  let isAuthenticated;
  let file = {
    name: "",
    dataType: "application/pdf",
    data: "",
  };
  let permissionError = false;

  actor.subscribe((value) => (actorValue = value));
  authClient.subscribe((value) => (authClientValue = value));

  onMount(async () => {
    authClient.set(await AuthClient.create());
    isAuthenticated = await authClientValue.isAuthenticated();

    // Canister IDs are automatically expanded to .env config - see vite.config.ts
    const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
    // We pass the host instead of using a proxy to support NodeJS >= v17 (ViteJS issue: https://github.com/vitejs/vite/issues/4794)
    const host = import.meta.env.VITE_HOST;
    // Create an actor to interact with the IC for a particular canister ID
    actor.set(createActor(canisterId, { agentOptions: { host } }));
    if (isAuthenticated) {
      let downloadedFile = await actorValue.download_file(fileId);
      console.log(downloadedFile);
      permissionError = downloadedFile.permission_error;
      if (!permissionError) {
        let files = await actorValue.get_requests();
        files.every((entry) => {
          if (entry.file_id == BigInt(fileId)) {
            file.name = entry.file_name;
            return false;
          }
          return true;
        });
        let decryptedFile = await File.fromEncrypted(
          file.name,
          new ArrayBuffer(downloadedFile.found_file.contents),
          new ArrayBuffer(downloadedFile.found_file.file_key)
        );
        file.data = Buffer.from(decryptedFile.contents).toString("base64");
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
  {#if isAuthenticated && !permissionError}
    <Details file={file.data} />
    {#if file && file.data}
      <h4>File Preview</h4>
      <FilePreview {file} />
    {/if}
  {:else}
    <Alert color="warning">
      <h4 class="alert-heading text-capitalize">warning</h4>
      User must be authenticated and authorized.
    </Alert>
  {/if}
</section>
