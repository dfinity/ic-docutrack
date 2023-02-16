<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import {
    actor,
    isAuthenticated,
  } from "$lib/shared/stores/auth.js";
  import ContentTable from "$lib/components/ContentTable.svelte";

  let data = null;
  let tableColumns = [
    { key: "name", label: "Name" },
    { key: "access", label: "Access" },
    { key: "uploadedAt", label: "Uploaded At" },
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
      const fileData = await actorValue.get_requests();
      let newData = [];
      // Prepare data for page template
      for (let idx = 0; idx < fileData.length; ++idx) {
        if (fileData[idx].file_status.uploaded) {
          let detailsLink = new URL($page.url.origin + "/details");
          detailsLink.searchParams.append("fileId", fileData[idx].file_id);
          const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timezone: 'CET', hour12: false };
          let uploadedAt = new Date(Math.floor(Number(fileData[idx].file_status.uploaded.uploaded_at) / 1000000));
          newData.push({
            name: fileData[idx].file_name,
            access: "Only You",
            uploadedAt: uploadedAt.toLocaleTimeString("en-CH", dateOptions),
            items: [{ url: detailsLink, text: "Open" }],
          });
        }
      }
      // Assign `data` to itself for reactivity purposes
      data = newData;
    } else {
      data = [];
    }
  }

  // If there is a change to the backend actor, reload the data of the page
  // actor.subscribe(async (value) => {
  // await syncBackend(value);
  // });

  // The vars are not persistent, hence they have to be reloaded `onMount`
  onMount(async () => {
    await syncBackend(actorValue);
  });
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="DokuTrack" />
</svelte:head>

<section>
  {#if isAuthenticatedValue === null || data === null}
    <h3>Loading...</h3>
  {:else if isAuthenticatedValue}
    <ContentTable columns={tableColumns} {data} />
  {:else}
    <h3>Please log in to see your data.</h3>
  {/if}
</section>
