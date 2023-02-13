<script lang="ts">
	import ContentTable from '$lib/components/ContentTable.svelte';

	export let data;

	let tableColumns = [
		{ key: 'name', label: 'Name' },
		{ key: 'access', label: 'Access' }
	];
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="DokuTrack" />
</svelte:head>

<section>
	<ContentTable columns={tableColumns} {data} />
</section>
