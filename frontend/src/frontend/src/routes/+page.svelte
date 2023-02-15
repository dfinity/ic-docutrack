<script lang="ts">
  import { onMount } from "svelte";
  import {
    actor,
    isAuthenticated,
  } from "$lib/shared/stores/auth.js";
  import ContentTable from "$lib/components/ContentTable.svelte";

  let data = null;
  let tableColumns = [
    { key: "name", label: "Name" },
    { key: "access", label: "Access" },
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
      const fileData = await backend.get_files();
      console.log("file data: ", fileData);
      let newData = [];
      // Prepare data for page template
      for (let idx = 0; idx < fileData.length; ++idx) {
        newData.push({
          name: fileData[idx].file_name,
          access: "Only You",
          items: [{ url: "/details/" + fileData[idx].file_id, text: "Open" }],
        });
      }
      // Assign `data` to itself for reactivity purposes
      data = newData;
      console.log("Sync func: ", newData);
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
    console.log("Home onMount started.");
    console.log("isAuth: ", isAuthenticatedValue);
    await syncBackend(actorValue);
    console.log("Home onMount finished.");
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
