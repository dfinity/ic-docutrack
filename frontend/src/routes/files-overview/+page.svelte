<script>
  import { Alert } from 'sveltestrap';

  import { principal } from '$lib/shared/stores/auth.js';
  import ContentTable from '$lib/components/ContentTable.svelte';

  let principalValue;
  $: tableColumns = [];
  $: tableData = [];

  principal.subscribe( value => principalValue = value);

  function getAccessibleFiles() {
    // Backend call to get all the files requested by the principal
    let accessibleFiles;
    return accessibleFiles;
  }

  function formatTableData(accessibleFiles) {
    // TODO: based on the different possible outputs from the backend, move this function to lib/utils
    // Transform the output from the backend in columns and rows
    // in order to render the Table
    let row;
    tableData.push(row);
  }

</script>

{#if principalValue}
  <ContentTable columns={tableColumns} data={tableData}/>
{:else}
  <Alert color="warning">
    <h4 class="alert-heading text-capitalize">warning</h4>
    User must be authenticated.
  </Alert>
{/if}
