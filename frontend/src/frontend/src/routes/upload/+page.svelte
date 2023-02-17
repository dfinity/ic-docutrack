<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import FilePreview from "$lib/components/FilePreview.svelte";
  import File from "$lib/file";
  import { actor } from "$lib/shared/stores/auth.js";

  const alias = $page.url.searchParams.get("alias") || "";

  let loading = true;
  let uploadingStatus = "";
  let fileInfo = null;
  let file;
  let files;
  let actorValue;
  let requestStatus = "";
  actor.subscribe(async (value) => {
    actorValue = value;
  });

  onMount(async () => {
    fileInfo = await actorValue.get_alias_info(alias);
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
    requestStatus = "Loading";
    const fileSelector = document.getElementById("file-selector");
    const fileBytes = await fileSelector.files[0].arrayBuffer();
    let fileToEncrypt = File.fromUnencrypted(fileInfo.Ok.file_name, fileBytes);
    const encryptedFileKey = await fileToEncrypt.getEncryptedFileKey(
      fileInfo.Ok.user.public_key.buffer
    );
    const encFile = await fileToEncrypt.encrypt();
    // Upload file
    uploadingStatus = "Uploading...";
    const res = await actorValue.upload_file({
      file_id: fileInfo.Ok.file_id,
      file_content: new Uint8Array(encFile),
      owner_key: new Uint8Array(encryptedFileKey),
      file_type: file.dataType,
    });

    if ("Ok" in res) {
      uploadingStatus = "File uploaded successfully.";
      requestStatus = "Uploaded!";
    } else {
      uploadingStatus = "An error occurred. Try again.";
      requestStatus = "";
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
      {#if requestStatus}
        <button class="btn btn-primary" type="submit" disabled>{requestStatus}</button>
      {:else}
        <button class="btn btn-primary" type="submit">Upload</button>
      {/if}
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
