<script>
  export let file;
  let previewStyle;
  let previewClass;

  const supportedDataTypes = [
    "application/pdf",
    "image/jpg",
    "image/jpeg",
    "image/png",
  ];
  $: previewStyle =
    file.dataType === "application/pdf" ? "--bs-aspect-ratio: 141%" : "";
  $: previewClass = file.dataType === "application/pdf" ? "ratio" : "";
</script>

<div
  class="d-flex justify-content-center mb-3 {previewClass}"
  style={previewStyle}
>
  {#if supportedDataTypes.includes(file.dataType)}
    <embed
      width="100%"
      height="100%"
      name="plugin"
      src="data:{file.dataType};base64,{file.data}"
    />
  {:else}
    <p>No preview available.</p>
  {/if}
</div>
