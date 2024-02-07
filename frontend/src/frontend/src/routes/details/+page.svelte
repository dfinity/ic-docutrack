<script lang="ts">
  import { goto } from "$app/navigation";
  import Details from "$lib/components/Details/Details.svelte";
  import { authStore } from "$lib/services/auth";

  $: {
    if ($authStore.state === "unauthenticated") {
      goto("/");
    }
  }
</script>

{#if $authStore.state === "uninitialized"}
  <h1 class="title-1">Loading...</h1>
{:else if $authStore.state === "authenticated"}
  <Details auth={$authStore} />
{/if}
