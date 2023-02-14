<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { createActor } from "../../../../declarations/backend";
  import FilePreview from "../../lib/components/FilePreview.svelte";

  const alias = $page.url.searchParams.get("alias") || "";
  const host = import.meta.env.VITE_HOST;
  const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
  const backend = createActor(canisterId, { agentOptions: { host } });

  let loading = true;
  let uploadingStatus = "";
  let fileInfo = null;
  let file;
  let files;

  onMount(async () => {
    console.log(canisterId);
    console.log(host);

    fileInfo = await backend.get_alias_info(alias);
    console.log(fileInfo);
    loading = false;
  });

  function onChange() {
    if (files) {
      let inputFile = files[0];

      const reader = new FileReader();

      file = {
        name: inputFile.name,
        dataType: inputFile.type,
        data: "",
      };

      reader.readAsDataURL(inputFile);
      reader.onload = function () {
        let base64 = reader.result;
        let pattern = "base64,";
        let idx = base64.indexOf("base64,");
        file.data = base64.substring(idx + pattern.length);
      };
    }
  }

  const handleUpload = async () => {
    const fileSelector = document.getElementById("file-selector");
    const fileBytes = await fileSelector.files[0].arrayBuffer();
    // Upload file
    uploadingStatus = "Uploading...";
    const res = await backend.upload_file(
      fileInfo.Ok.file_id,
      new Uint8Array(fileBytes),
      new Uint8Array([1, 2, 3])
    );

    if ("Ok" in res) {
      uploadingStatus = "File uploaded successfully.";
    } else {
      uploadingStatus = "An error occurred. Try again.";
      console.log(res);
    }
  };
</script>

<h1>File Upload</h1>
{#if loading}
  <p>Loading...</p>
{:else if fileInfo.Ok}
  <p>File name: {fileInfo.Ok.file_name}</p>
  <form class="row g3" on:submit|preventDefault={handleUpload}>
    <div class="col-auto">
      <input
        bind:files
        on:change={onChange}
        class="form-control"
        type="file"
        id="file-selector"
        required
      />
    </div>
    <div class="col-auto">
      <button class="btn btn-primary" type="submit">Upload</button>
    </div>
  </form>
  <span>{uploadingStatus}</span>
  <br />
  {#if file && file.data}
    <h4>File Preview</h4>
    <FilePreview {file} />
  {/if}
{:else if "not_found" in fileInfo.Err}
  <p>Unknown alias.</p>
{:else}
  <p>Something else is wrong.</p>
{/if}
