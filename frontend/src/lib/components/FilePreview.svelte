<script>
// E.g. "application/pdf", "image/jpg", "text/html"
export let dataType;
export let fileBase64;

const supportedDataTypes = ['application/pdf', 'image/jpg', 'image/png'];
</script>

<div class="d-flex justify-content-center mb-3">
    {#if supportedDataTypes.includes(dataType)}
        <embed width="100%" height="100%" name="plugin" src="data:{dataType};base64,{fileBase64}" />
{:else}
    <p>No preview available.</p>
{/if}
</div>