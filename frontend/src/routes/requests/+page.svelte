<script>
  import { Alert } from 'sveltestrap';

  import { principal } from '$lib/shared/stores/auth.js';
  import ContentTable from '$lib/components/ContentTable.svelte';
  import RequestModal from '$lib/components/RequestModal.svelte';

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
    return null;
  }

  function formatTableData(requestedFiles) {
    // TODO: based on the different possible outputs from the backend, move this function to lib/utils
    // Transform the output from the backend in columns and rows
    // in order to render the Table
    let row;
    tableData.push(row);
    return tableColumns;
  }

	const setupPoller = () => {
		if (poller) {
			clearInterval(poller);
		}
		poller = setInterval(doPoll(), 2000);
	}

	const doPoll = () => async () => {
		tableData = await new Promise(resolve => setTimeout(() => {
			resolve(formatTableData(getRequestedFiles()))
		}, 500));
	}

	$: setupPoller();
</script>

{#if principalValue}
  <RequestModal isOpen={false}/>
  <br>
  <ContentTable columns={tableColumns} data={tableData}/>
{:else}
  <Alert color="warning">
    <h4 class="alert-heading text-capitalize">warning</h4>
    User must be authenticated.
  </Alert>
{/if}
