<script>
	import { Table } from 'sveltestrap';
	import FilePreview from '../../../lib/components/FilePreview.svelte';

	export let data;
	let isFileSubmitted = false;
	let files;
	let file;
	let fileData;

	function sendFile() {
    	// TODO: Add file encryption and submission to backend
		// ...
		// When successful, set flag
		isFileSubmitted = true;
	}

	function onChange() {
	 if(files) {
		let inputFile = files[0];
		let dataBase64;
		
		const reader = new FileReader();
		
		// reader.onload = function () {
		// 	// dataBase64 = reader.result;
		// 	log.console(reader.result)
		// };
		// reader.onerror = function (error) {
		// 	console.log('Error: ', error);
		// };
		file = {
			name: inputFile.name,
			dataType: inputFile.type,
			data: '',
		};

		reader.readAsDataURL(inputFile);
		reader.onload = function () {
			let base64 = reader.result;
			let pattern = 'base64,';
			let idx = base64.indexOf('base64,');
			file.data = base64.substring(idx+pattern.length);
		};
		return;
	}
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
			<input bind:files on:change={onChange} class="form-control" type="file" id="formFile">
		</div>
		<div class="mb-3">
			<button on:click={sendFile} class="btn btn-primary">Submit</button>
		</div>
		
		{#if file && file.data}
		<h4>File Preview</h4>
			<FilePreview {file}/>
		{/if}
	{/if}
	
</section>
