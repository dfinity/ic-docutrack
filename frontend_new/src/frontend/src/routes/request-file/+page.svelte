<script>
	import { Alert } from 'sveltestrap';

	import { principal } from '$lib/shared/stores/auth.js';
	import ContentTable from '$lib/components/ContentTable.svelte';
	import RequestModal from '$lib/components/RequestModal.svelte';

	export let data;
	let principalValue;
	let tableColumns = [
		{ key: 'name', label: 'Name' },
		{ key: 'access', label: 'Access' }
	];

	principal.subscribe((value) => (principalValue = value));
</script>

<RequestModal isOpen={false} actor={data.actor} />

{#if principalValue}
	<ContentTable columns={tableColumns} data={data.tableData} />
{:else}
	<Alert color="warning">
		<h4 class="alert-heading text-capitalize">warning</h4>
		User must be authenticated.
	</Alert>
{/if}
