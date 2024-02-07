<script lang="ts">
  export let file: { objectUrl: string; dataType: string };
  let previewStyle;
  let previewClass;

  const supportedDataTypes = [
    "application/pdf",
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  $: previewStyle =
    file.dataType === "application/pdf" ? "--bs-aspect-ratio: 141%" : "";
  $: previewClass = file.dataType === "application/pdf" ? "" : "";
</script>

<div class="flex items-center mb-3 w-full {previewClass}" style={previewStyle}>
  {#if supportedDataTypes.includes(file.dataType)}
    {#if file.dataType.startsWith("image/")}
      <img alt="Preview" src={file.objectUrl} class="max-w-full" />
    {:else if file.dataType === "application/pdf"}
      <object
        title="PDF Preview"
        type="application/pdf"
        data={file.objectUrl}
        class="w-full aspect-square"
      />
    {:else}
      <slot />
    {/if}
  {:else}
    <slot />
  {/if}
</div>
