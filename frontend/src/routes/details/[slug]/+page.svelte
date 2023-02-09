<script>
	import Details from '$lib/components/Details.svelte'
	import FilePreview from '$lib/components/FilePreview.svelte'
	export let data;
</script>

<svelte:head>
	<title>DokuTrack: Details</title>
	<meta name="description" content="DokuTrack" />
</svelte:head>
<section>
	<h1>Details</h1>
	<Details file={data}/>
	<FilePreview file={data}/>
</section>

