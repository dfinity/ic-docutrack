<script lang="ts">
  import { page } from "$app/stores";
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";
  import CopyIcon from "./icons/CopyIcon.svelte";
  import type { AuthStateAuthenticated } from "$lib/services/auth";

  export let isOpen = false;
  export let auth: AuthStateAuthenticated;

  let requestLink: URL | null = null;
  let loading: boolean = false;
  let requestName: string = "";
  let copied = false;

  const dispatch = createEventDispatcher<{
    "request-created": void;
    "request-completed": void;
  }>();

  async function updateRequestUrl(e) {
    loading = true;
    const formData = new FormData(e.target);
    const data: any = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }

    // Do not request new url when there is already one
    if (data.requestName && !data.requestLink) {
      requestName = data.requestName;
      const alias = await auth.actor.request_file(data.requestName);
      requestLink = new URL($page.url.origin + "/upload");
      requestLink.searchParams.append("alias", alias);
    }
    loading = false;

    dispatch("request-created");
  }

  function close() {
    if (requestLink) {
      dispatch("request-completed");
    }

    isOpen = false;
    requestName = "";
    requestLink = null;
  }

  async function copyText() {
    if (requestLink) {
      await navigator.clipboard.writeText(requestLink.toString());
      copied = true;
    }
  }
</script>

<div>
  <Modal bind:isOpen title="Create Request" on:cancelled={close}>
    <form class="w-full md:w-96" on:submit|preventDefault={updateRequestUrl}>
      <div class="">
        <label for="requestName" class="input-label">Request Name</label>

        <input
          type="text"
          required={true}
          class="input"
          id="requestName"
          placeholder="Enter your input"
          name="requestName"
          disabled={!!requestLink}
          readonly={!!requestLink}
        />
      </div>
      <div class="mt-3">
        {#if requestLink}
          <div class="flex justify-between items-center">
            <label for="requestLink" class="input-label"> Request Link </label>
            {#if copied}
              <span class="text-text-100 body-1"> Copied! </span>
            {/if}
          </div>
          <div class="relative">
            <input
              type="text"
              class="input pr-10"
              id="requestLink"
              placeholder=""
              name="requestLink"
              value={requestLink}
              readonly
            />
            <button
              class="btn btn-icon absolute right-0 top-1/2 -translate-y-1/2"
              on:click={copyText}
            >
              <CopyIcon />
            </button>
          </div>
          <div class="mt-4">
            <a
              href="mailto:?subject=Share your file&body=Please share a file with me here: {requestLink}"
              class="text-accent-100">Send in email</a
            >
          </div>
        {/if}
      </div>
      <div class=" mt-10">
        {#if loading}
          <button type="submit" class="btn btn-accent btn-full btn-" disabled
            >Generating link...</button
          >
        {:else if !loading && requestLink}
          <button type="button" class="btn btn-accent btn-full" on:click={close}
            >Request sent, close this window</button
          >
        {:else}
          <button type="submit" class="btn btn-accent btn-full"
            >Generate link</button
          >
        {/if}
      </div>
    </form>
  </Modal>
</div>
