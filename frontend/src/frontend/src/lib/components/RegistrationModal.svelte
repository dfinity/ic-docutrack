<script lang="ts">
  import type { AuthStateAuthenticated } from "$lib/services/auth";
  import { userStore } from "$lib/services/user";
  import { unreachable } from "$lib/shared/unreachable";
  import ErrorMessage from "./ErrorMessage.svelte";
  import Modal from "./Modal.svelte";

  export let isOpen = false;
  export let authenticatedStore: AuthStateAuthenticated;

  let usernameValue;

  function register() {
    if ($userStore.state === "unregistered") {
      authenticatedStore.userService.register(usernameValue);
    }
  }
</script>

<div>
  <Modal {isOpen} title="Register Yourself" mandatory>
    <form class="" on:submit|preventDefault={() => register()}>
      <p class="body-1 text-text-200 mb-4">
        Your Internet Identity is not connected with a username yet. Choose a
        username to setup an account on DocuTrack. Your username will be
        publicly visible
      </p>
      <div class="mb-4">
        <label for="username" class="input-label">Username</label>
        <input
          type="text"
          required
          class="input"
          bind:value={usernameValue}
          placeholder="Username"
        />
      </div>
      <div class="mt-10">
        {#if $userStore.state === "unregistered"}
          {#if $userStore.registrationState.state === "registering"}
            <button type="button" class="btn btn-full btn-accent" disabled
              >Loading...</button
            >
          {:else if $userStore.registrationState.state === "error"}
            <ErrorMessage class="mb-4">
              {$userStore.registrationState.errorMessage}
            </ErrorMessage>
            <button type="submit" class="btn btn-full btn-accent">Submit</button
            >
          {:else if $userStore.registrationState.state === "idle"}
            <button type="submit" class="btn btn-full btn-accent">Submit</button
            >
          {:else}
            {unreachable($userStore.registrationState)}
          {/if}
        {:else}
          <button type="submit" class="btn btn-full btn-accent">Submit</button>
        {/if}
      </div>
    </form>
  </Modal>
</div>
