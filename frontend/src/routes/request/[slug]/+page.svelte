<script>
	import { Table } from 'sveltestrap';

	export let data;
	let isFileSubmitted = false;

	function sendFile() {
    	// TODO: Add file encryption and submission to backend
		// ...
		// When successful, set flag
		isFileSubmitted = true;
	}
</script>

<svelte:head>
	<title>DokuTrack: Request</title>
	<meta name="description" content="DokuTrack: Requests" />
</svelte:head>

<section>
	<h1>File Upload</h1>
	<h3 class="mt-4">{data.fileName}</h3>
	{#if isFileSubmitted}
		<p>File has been submitted. Thank you!</p>
	{:else}
		<div class="my-3">
			<label for="formFile" class="form-label">Upload your file</label>
			<input class="form-control" type="file" id="formFile">
		</div>
		<button on:click={sendFile} class="btn btn-primary">Submit</button>
	{/if}
	
</section>

