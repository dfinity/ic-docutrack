<script lang="ts">
  import type { AuthStateAuthenticated } from "$lib/services/auth";
  import { userStore } from "$lib/services/user";
  import Modal from "./Modal.svelte";

  export let isOpen = false;
  export let authenticatedStore: AuthStateAuthenticated;

  let firstNameValue;
  let lastNameValue;

  function register() {
    if ($userStore.state === "unregistered") {
      authenticatedStore.userService.register(firstNameValue, lastNameValue);
    }
  }
</script>

<div>
  <Modal {isOpen} title="Register Yourself" mandatory>
    <form class="" on:submit|preventDefault={() => register()}>
      <p class="body-1 text-text-200 mb-4">
        Your Internet Identity is not connected with a name yet. Enter your name
        to setup an account on DocuTrack.
      </p>
      <div class="mb-4">
        <label for="firstName" class="input-label">First Name</label>
        <input
          type="text"
          required
          class="input"
          bind:value={firstNameValue}
          placeholder="First Name"
        />
      </div>
      <div class="mb-4">
        <label for="lastName" class="input-label">Last Name</label>
        <input
          type="text"
          required={true}
          class="input"
          placeholder="Last Name"
          bind:value={lastNameValue}
        />
      </div>
      <div class="mt-10">
        {#if $userStore.state === "unregistered" && $userStore.registrationState === "registering"}
          <button type="button" class="btn btn-full btn-accent" disabled
            >Loading...</button
          >
        {:else}
          <button type="submit" class="btn btn-full btn-accent">Submit</button>
        {/if}
      </div>
    </form>
  </Modal>
</div>
