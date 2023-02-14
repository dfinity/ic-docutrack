<script>
  import { Alert } from "sveltestrap";
  import { onMount } from "svelte";
  import { AuthClient } from "@dfinity/auth-client";

  import ContentTable from "$lib/components/ContentTable.svelte";
  import { authClient } from "$lib/shared/stores/auth.js";

  let authClientValue;
  let isAuthenticated = false;
  authClient.subscribe((value) => (authClientValue = value));

  onMount(async () => {
    authClient.set(await AuthClient.create());
    isAuthenticated = await authClientValue.isAuthenticated();
  });

  $: tableColumns = [];
  $: tableData = [];

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

{#if isAuthenticated}
  <ContentTable columns={tableColumns} data={tableData} />
{:else}
  <Alert color="warning">
    <h4 class="alert-heading text-capitalize">warning</h4>
    User must be authenticated.
  </Alert>
{/if}
