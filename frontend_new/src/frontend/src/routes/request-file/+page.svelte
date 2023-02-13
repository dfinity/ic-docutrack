<script>
	import { Alert } from 'sveltestrap';
	import { onMount } from 'svelte';
	import { AuthClient } from '@dfinity/auth-client';

	import { authClient } from '$lib/shared/stores/auth.js';
	import ContentTable from '$lib/components/ContentTable.svelte';
	import RequestModal from '$lib/components/RequestModal.svelte';

	let authClientValue;
	let isAuthenticated = false;
	authClient.subscribe((value) => (authClientValue = value));

	export let data;
	let principalValue;
	let tableColumns = [
		{ key: 'name', label: 'Name' },
		{ key: 'access', label: 'Access' }
	];

	onMount(async () => {
		authClient.set(await AuthClient.create());
		isAuthenticated = await authClientValue.isAuthenticated();
	});
</script>

<RequestModal isOpen={false} actor={data.actor} />

{#if isAuthenticated}
	<ContentTable columns={tableColumns} data={data.tableData} />
{:else}
	<Alert color="warning">
		<h4 class="alert-heading text-capitalize">warning</h4>
		User must be authenticated.
	</Alert>
{/if}
