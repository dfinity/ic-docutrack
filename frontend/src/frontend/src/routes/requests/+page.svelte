<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import ContentTable from "$lib/components/ContentTable.svelte";
  import RequestModal from "$lib/components/RequestModal.svelte";
  import { actor, isAuthenticated } from "$lib/shared/stores/auth.js";

  let data = null;
  let tableColumns = [
    { key: "name", label: "Name" },
    { key: "access", label: "Access" },
    { key: "requestedAt", label: "Requested At" },
    { key: "alias", label: "Alias" },
  ];
  let actorValue;
  let isAuthenticatedValue;

  actor.subscribe((value) => {
    actorValue = value;
  });
  isAuthenticated.subscribe((value) => {
    isAuthenticatedValue = value;
  });

  async function syncBackend(backend) {
    if (backend) {
      const fileData = await backend.get_requests();
      let newData = [];
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timezone: 'CET', hour12: false };

      // Prepare data for page template
      for (let idx = 0; idx < fileData.length; ++idx) {
        if (fileData[idx].file_status.pending) {
          let detailsLink = new URL($page.url.origin + "/details");
          detailsLink.searchParams.append("fileId", fileData[idx].file_id);
          let requestedAt = new Date(Math.floor(Number(fileData[idx].file_status.pending.requested_at) / 1000000));
          newData.push({
            name: fileData[idx].file_name,
            access: "Only You",
            requestedAt: requestedAt.toLocaleTimeString("en-CH", dateOptions),
            alias: fileData[idx].file_status.pending.alias,
          });
        }
      }
      data = newData;
    } else {
      data = [];
    }
  }

  // The vars are not persistent, hence they have to be reloaded `onMount`
  onMount(async () => {
    await syncBackend(actorValue);
  });
</script>

<svelte:head>
  <title>Requests</title>
  <meta name="description" content="DocuTrack" />
</svelte:head>

<section>
  {#if isAuthenticatedValue === null || data === null}
    <h3>Loading...</h3>
  {:else if isAuthenticatedValue}
    <RequestModal isOpen={false} />
    <br />
    <ContentTable columns={tableColumns} {data} />
  {:else}
    <h3>Please log in to see your data.</h3>
  {/if}
</section>
