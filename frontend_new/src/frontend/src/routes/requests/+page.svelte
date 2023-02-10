<script>
	import { Alert } from 'sveltestrap';

	import { principal } from '$lib/shared/stores/auth.js';
	import ContentTable from '$lib/components/ContentTable.svelte';
	import RequestModal from '$lib/components/RequestModal.svelte';

	let principalValue;
	let alias;
	let requestedFiles = [];
	$: tableColumns = [];
	$: tableData = [];
	// Polling
	let progress = {};
	let poller;

	principal.subscribe((value) => (principalValue = value));

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

{#if principalValue}
	<RequestModal isOpen={false} />
	<br />
	<!-- <ContentTable columns={tableColumns} data={tableData}/> -->
{:else}
	<Alert color="warning">
		<h4 class="alert-heading text-capitalize">warning</h4>
		User must be authenticated.
	</Alert>
{/if}
