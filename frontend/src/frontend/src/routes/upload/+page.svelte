<script lang="ts">
  import Upload from "$lib/components/Upload/Upload.svelte";
  import { authStore } from "$lib/services/auth";
</script>

{#if $authStore.state === "authenticated" || $authStore.state === "unauthenticated"}
  <Upload auth={$authStore} />
{/if}
