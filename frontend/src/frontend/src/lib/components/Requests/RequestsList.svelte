<script lang="ts">
  import RequestModal from "$lib/components/RequestModal.svelte";
  import PlaceholderLogo from "$lib/components/icons/PlaceholderLogo.svelte";
  import type { AuthStateAuthenticated } from "$lib/services/auth";
  import { requestsStore } from "$lib/services/requests";
  import { onMount } from "svelte";

  export let auth: AuthStateAuthenticated;

  onMount(() => {
    auth.requestService.init();
  });

  let isOpenRequestModal = false;
</script>

<section>
  <RequestModal
    bind:isOpen={isOpenRequestModal}
    on:request-created={() => auth.requestService.reload()}
    {auth}
  />
  {#if $requestsStore.state === "idle" || $requestsStore.state === "loading"}
    <h1 class="title-1">Loading...</h1>
  {:else if $requestsStore.state === "error"}
    <div class="">
      <h1 class="title-1">Requests</h1>
      <p>Error loading requests: {$requestsStore.error}</p>
    </div>
  {:else if $requestsStore.state === "loaded"}
    <div class="flex justify-between items-center mb-6">
      <h1 class="title-1">Requests</h1>
      {#if $requestsStore.requests.length > 0}
        <button
          class="hidden md:inline-block btn btn-accent"
          on:click={() => (isOpenRequestModal = true)}
          >Create new file request</button
        >
      {/if}
    </div>
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-background-200 p-4">
      <button
        class="btn btn-accent btn-full"
        on:click={() => (isOpenRequestModal = true)}
        >Create new file request</button
      >
    </div>
    {#if $requestsStore.requests.length > 0}
      <div class="hidden md:block bg-background-200 w-full rounded-2xl px-2">
        <table class="table-auto w-full border-spacing-y-2 border-separate">
          <thead class="">
            <tr class="body-2 text-text-200 text-left">
              <th class="body-2 pt-4 pb-2 pl-4">Name</th>

              <th class="body-2 pt-6 pb-2">Access</th>
              <th class="body-2 pt-6 pb-2">Uploaded at</th>
              <th class="body-2 pt-6 pb-2">Link</th>
            </tr>
          </thead>
          <tbody class="">
            {#each $requestsStore.requests as request}
              <tr class="text-text-100">
                <td
                  class="pl-4 bg-background-100 rounded-tl-xl rounded-bl-xl body-1 h-[52px]"
                  >{request.name}</td
                >
                <td class="bg-background-100 body-1">{request.access}</td>
                <td class="bg-background-100 body-1">{request.formattedDate}</td
                >
                <td
                  class="pr-4 bg-background-100 rounded-tr-xl rounded-br-xl body-1"
                >
                  <a
                    href="/upload?alias={request.alias}"
                    class="underline text-accent-100"
                  >
                    {request.alias}
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="md:hidden flex flex-col gap-2">
        {#each $requestsStore.requests as request}
          <div class="bg-white rounded-xl py-3 px-4 flex flex-col">
            <div class="mb-3">
              <span class="text-text-100 title-2">
                {#if request.name}
                  {request.name}
                {:else}
                  <span class="opacity-50">Unnamed request</span>
                {/if}
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <span class="body-1 text-text-200">Access:</span>
                <span class="body-1 text-text-100">{request.access}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="body-1 text-text-200">Uploaded at:</span>
                <span class="body-1 text-text-100"
                  >{request.formattedDateShort}</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="body-1 text-text-200">Alias:</span>
                <span class="body-1 text-text-100">
                  <a
                    href="/upload?alias={request.alias}"
                    class="underline text-accent-100"
                  >
                    {request.alias}
                  </a>
                </span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="panel pt-10 pb-4 text-center flex flex-col items-center gap-4 mt-6"
      >
        <PlaceholderLogo />
        <h2 class="title-2 text-text-200">
          You don't have any upload requests.
        </h2>
        <div class="pt-4 pb-8">
          <button
            class="btn btn-accent md:w-96"
            on:click={() => (isOpenRequestModal = true)}
            >Create new file request</button
          >
        </div>
      </div>
    {/if}
  {/if}
</section>
