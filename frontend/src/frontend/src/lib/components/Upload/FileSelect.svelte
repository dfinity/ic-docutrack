<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let type: "self" | "request" = "self";
  export let disabled: boolean = false;
  export let fileName: string = "";

  let fileNameAutoFilled: boolean = false;

  function markManualFileNameEntry() {
    fileNameAutoFilled = false;
  }

  const dispatch = createEventDispatcher<{ "file-selected": File | null }>();

  let files: FileList;

  function onChange() {
    const file = files[0];
    if (
      file &&
      type === "self" &&
      (fileNameAutoFilled || fileName.trim() === "")
    ) {
      fileNameAutoFilled = true;
      fileName = file.name;
    }

    if (!file && fileNameAutoFilled) {
      fileName = "";
    }

    dispatch("file-selected", file);
  }
</script>

{#if type === "self"}
  <div class="">
    <label for="fileName" class="input-label">File Name</label>
    <input
      type="text"
      required={true}
      class="input"
      id="fileName"
      name="fileName"
      placeholder="File name"
      {disabled}
      bind:value={fileName}
      on:input={markManualFileNameEntry}
    />
  </div>
{/if}
<div class="mb-3">
  <label for="fileNfile-selectorame" class="input-label">File to upload</label>
  <input
    bind:files
    on:change={onChange}
    id="file-selector"
    required
    {disabled}
    class="
          block
          w-full
          file:cursor-pointer
          file:disabled:cursor-auto
          file:py-2 file:px-4
          file:body-1 file:text-text-100
          file:rounded-full file:bg-silver file:border-none
          file:mr-2
          hover:file:brightness-110
          hover:file:disabled:brightness-100
          file:disabled:bg-silver/50
          p-2
          bg-background-100 rounded-md disabled:bg-background-300
          border-silver border-solid border-[1.5px]
          text-text-100
          body-1"
    type="file"
  />
</div>
