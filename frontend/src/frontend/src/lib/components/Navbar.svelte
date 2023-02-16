<script lang="ts">
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
  } from "sveltestrap";

  import RegistrationModal from "$lib/components/RegistrationModal.svelte";

  import { createActor } from "../../../../declarations/backend";
  import { AuthClient } from "@dfinity/auth-client";
  import {
    actor,
    authClient,
    firstName,
    lastName,
    isAuthenticated,
  } from "$lib/shared/stores/auth.js";

  let isOpen = false;
  let isOpenRegistrationModal = false;

  let actorValue;
  let authClientValue;
  let firstNameValue;
  let isAuthenticatedValue;

  actor.subscribe((value) => (actorValue = value));
  authClient.subscribe(async (value) => {
    authClientValue = value;
  });
  isAuthenticated.subscribe((value) => (isAuthenticatedValue = value));
  firstName.subscribe((value) => (firstNameValue = value));

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  const handleLogin = async () => {
    try {
      // Canister IDs are automatically expanded to .env config - see vite.config.ts
      const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
      // We pass the host instead of using a proxy to support NodeJS >= v17 (ViteJS issue: https://github.com/vitejs/vite/issues/4794)
      const host = import.meta.env.VITE_HOST;
      // Find out which URL should be used for login.
      const iiUrl =
        "http://127.0.0.1:8000/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai";
      await new Promise((resolve, reject) => {
        authClientValue.login({
          identityProvider: iiUrl,
          onSuccess: resolve,
          onError: reject,
        });
      });
      isAuthenticated.set(await authClientValue.isAuthenticated());
      // Create an actor to interact with the IC for a particular canister ID
      actor.set(
        createActor(canisterId, {
          agentOptions: { host, identity: authClientValue.getIdentity() },
        })
      );
      // Assign to itself for reactivity purposes
      authClient.set(authClientValue);

      let record = await actorValue.who_am_i();
      if ("unknown_user" in record) {
        isOpenRegistrationModal = true;
      } else {
        firstName.set(record.known_user.first_name);
        lastName.set(record.known_user.last_name);
      }
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await authClientValue.logout();
    isAuthenticated.set(false);
    actor.set(null);
    firstName.set(null);
    lastName.set(null);
    // authClient.set(null);
    authClient.set(await AuthClient.create());
  };
</script>

{#if isAuthenticatedValue !== null}
  <Navbar color="light" light expand="md">
    <NavbarBrand href="/">DocuTrack</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
      {#if firstNameValue}
        <Nav class="ms-md-3">
          <NavItem>
            Hi, {firstNameValue}
          </NavItem>
        </Nav>
        <Nav class="ms-auto" navbar>
          <NavItem>
            <NavLink href="/">My Files</NavLink>
          </NavItem>

          <NavItem>
            <NavLink href="/requests">Requests</NavLink>
          </NavItem>

          <NavItem>
            <NavLink on:click={handleLogout}>Logout</NavLink>
          </NavItem>
        </Nav>
      {:else}
        <Nav class="ms-auto" navbar>
          <NavItem>
            <!-- Add link to the II login -->
            <NavLink on:click={handleLogin}>Login</NavLink>
          </NavItem>
        </Nav>
      {/if}
    </Collapse>
    <RegistrationModal isOpen={isOpenRegistrationModal} />
  </Navbar>
{/if}
