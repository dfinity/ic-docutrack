<script>
  import {Alert} from 'sveltestrap';

  import principal from '$lib/shared/stores/auth.js';
  import ContentTable from '$lib/components/ContentTable.svelte';

  let principalValue;
  let requestedFiles = [];
  $: tableColumns = [];
  $: tableData = [];
  // Polling
  let progress = {};
	let poller;

  principal.subscribe( value => principalValue = value);

  function getRequestedFiles() {
    // Backend call to get all the files requested by the principal
    return newNumber;
  }

  function formatTableData(requestedFiles) {
    // TODO: based on the different possible outputs from the backend, move this function to lib/utils
    // Transform the output from the backend in columns and rows
    // in order to render the Table
  }

	const setupPoller = () => {
		if (poller) {
			clearInterval(poller);
		}
		poller = setInterval(doPoll(), 2000);
	}

	const doPoll = () => async () => {
		await new Promise(resolve => setTimeout(() => {
			resolve(formatTableData(getRequestedFiles()))
		}, 500));
	}

	$: setupPoller();
</script>

{#if principalValue}
  <Table columns={tableColumns} data={tableData}/>
{:else}
  <Alert>
    <h4 class="alert-heading text-capitalize">warning</h4>
    User must be authenticated.
  </Alert>
{/if}
