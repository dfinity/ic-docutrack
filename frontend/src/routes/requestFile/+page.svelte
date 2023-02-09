<script>
  import { Alert } from 'sveltestrap';
  import { Button } from 'sveltestrap';

  import { principal } from '$lib/shared/stores/auth.js';
  import ContentTable from '$lib/components/ContentTable.svelte';

  let principalValue;
  let requestedFiles = [];
  $: tableColumns = [0];
  $: tableData = [];
  // Polling
  let progress = {};
	let poller;

	let open = false;

  const toggle = () => (open = !open);

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

<Button color="default" on:click={toggle}>Create new request</Button>

{#if principalValue}
  <ContentTable columns={tableColumns} data={tableData}/>
{:else}
  <Alert color="warning">
    <h4 class="alert-heading text-capitalize">warning</h4>
    User must be authenticated.
  </Alert>
{/if}
