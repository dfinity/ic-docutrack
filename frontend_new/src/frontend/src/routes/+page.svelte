<script lang="ts">
	import ContentTable from '$lib/components/ContentTable.svelte';

	export let data;

	$: tableColumns = [{ key: 'name', label: 'Name' }];
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="DokuTrack" />
</svelte:head>

<section>
	<ContentTable columns={tableColumns} {data} />
</section>
