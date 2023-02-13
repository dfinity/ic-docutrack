<script>
	import { Alert } from 'sveltestrap';
	import { onMount } from 'svelte';
	import { AuthClient } from '@dfinity/auth-client';

	import ContentTable from '$lib/components/ContentTable.svelte';
	import RequestModal from '$lib/components/RequestModal.svelte';
	import { authClient } from '$lib/shared/stores/auth.js';

	let authClientValue;
	let isAuthenticated = false;
	authClient.subscribe((value) => (authClientValue = value));

	onMount(async () => {
		authClient.set(await AuthClient.create());
		isAuthenticated = await authClientValue.isAuthenticated();
	});

	let principalValue;
	let alias;
	let requestedFiles = [];
	$: tableColumns = [];
	$: tableData = [];
	// Polling
	let progress = {};
	let poller;

	const setupPoller = () => {
		if (poller) {
			clearInterval(poller);
		}
		poller = setInterval(doPoll(), 2000);
	};

	const doPoll = () => async () => {
		tableData = await new Promise((resolve) =>
			setTimeout(() => {
				// resolve(formatTableData(getRequestedFiles()))
			}, 500)
		);
	};

	$: setupPoller();
</script>

{#if isAuthenticated}
	<RequestModal isOpen={false} />
	<br />
	<!-- <ContentTable columns={tableColumns} data={tableData}/> -->
{:else}
	<Alert color="warning">
		<h4 class="alert-heading text-capitalize">warning</h4>
		User must be authenticated.
	</Alert>
{/if}
