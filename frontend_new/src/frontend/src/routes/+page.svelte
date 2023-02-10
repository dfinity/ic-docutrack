<script lang="ts">
  import { actor } from '$lib/shared/stores/auth.js';
  import ContentTable from '$lib/components/ContentTable.svelte';

  export let tableData;

  $: tableColumns = [{key: "name", label: "Name"}];
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="DokuTrack" />
</svelte:head>

<section>
    <ContentTable columns={tableColumns} data={tableData}/>
</section>
