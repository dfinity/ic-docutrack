<script>
  import { principal } from '$lib/shared/stores/auth.js';
  import ContentTable from '$lib/components/ContentTable.svelte';

  let principalValue;
  $: tableColumns = [{key: "name", label: "Name"}, {key: "access", label: "Access"}];
  $: tableData = [{name: "escrow_hotel_zurich.docx", access: "Only you", items: [{url: "#", text: "Open"}]}];

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

<svelte:head>
	<title>Home</title>
	<meta name="description" content="DokuTrack" />
</svelte:head>

<section>
    <ContentTable columns={tableColumns} data={tableData}/>
</section>
