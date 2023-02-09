<script>
export let file;

const supportedDataTypes = ['application/pdf', 'image/jpg', 'image/png'];
</script>

<div class="d-flex justify-content-center mb-3">
    {#if supportedDataTypes.includes(file.dataType)}
        <embed width="100%" height="100%" name="plugin" src="data:{file.dataType};base64,{file.data}" />
{:else}
    <p>No preview available.</p>
{/if}
</div>