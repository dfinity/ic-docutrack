<script>
    import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { createActor } from '../../../../declarations/backend';

    const alias = $page.url.searchParams.get('alias') || "";
    const host = import.meta.env.VITE_HOST;
    const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
    const backend = createActor(canisterId, { agentOptions: {host}});

    let loading = true;
    let uploadingStatus = "";
    let fileInfo = null;

    onMount(async () => {
        console.log(canisterId);
        console.log(host);


        fileInfo = await backend.get_alias_info(alias);
        console.log(fileInfo);
        loading = false;
    })

    const handleUpload = async () => {
        const fileSelector = document.getElementById("file-selector");
        const fileBytes = await fileSelector.files[0].arrayBuffer();
        // Upload file
        uploadingStatus = "Uploading...";
        const res = await backend.upload_file(fileInfo.Ok.file_id, new Uint8Array(fileBytes));

        if ('Ok' in res) {
            uploadingStatus = "File uploaded successfully.";
        } else {
            uploadingStatus = "An error occurred. Try again.";
            console.log(res);
        }
    }
</script>

<h1>File Upload</h1>
{#if loading}
    <p>Loading...</p>
{:else}
    {#if fileInfo.Ok}
        <p>File name: {fileInfo.Ok.file_name}</p>
        <input type="file" id="file-selector">
        <button on:click={handleUpload}>Upload</button>
        <span>{uploadingStatus}</span>
    {:else if 'not_found' in fileInfo.Err}
        <p>Unknown alias.</p>
    {:else}
        <p>Something else is wrong.</p>
    {/if}
{/if}
