<script lang="ts">
  import FileList from "$lib/components/Home/FileList.svelte";
  import NotAuthenticated from "$lib/components/Home/NotAuthenticated.svelte";
  import { authStore } from "$lib/services/auth";
</script>

<section>
  {#if $authStore.state === "uninitialized"}
    <h1 class="title-1">Loading...</h1>
  {:else if $authStore.state === "authenticated"}
    <FileList auth={$authStore} />
  {:else}
    <NotAuthenticated />
  {/if}
</section>
