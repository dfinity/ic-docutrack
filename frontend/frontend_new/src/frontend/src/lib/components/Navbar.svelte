<script lang="ts">
	import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'sveltestrap';

	import { createActor } from '../../../../declarations/backend';
	import { AuthClient } from '@dfinity/auth-client';

	import { principal, identity, actor } from '$lib/shared/stores/auth.js';
	import { default as crypto } from '$lib/crypto';

	let isOpen = false;

	let principalValue;
	let identityValue;
	let actorValue;
	principal.subscribe((value) => (principalValue = value));
	identity.subscribe((value) => (identityValue = value));
	actor.subscribe((value) => (actorValue = value));

	function handleUpdate(event) {
		isOpen = event.detail.isOpen;
	}
	let disabled = false;
	let greeting = '';

	const handleOnSubmit = async () => {
		disabled = true;
		try {
			// Canister IDs are automatically expanded to .env config - see vite.config.ts
			const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
			// We pass the host instead of using a proxy to support NodeJS >= v17 (ViteJS issue: https://github.com/vitejs/vite/issues/4794)
			const host = import.meta.env.VITE_HOST;
			// When the user clicks, we start the login process.
			// First we have to create and AuthClient.
			const authClient = await AuthClient.create();
			// Find out which URL should be used for login.
			const iiUrl = 'http://127.0.0.1:8000/?canisterId=r7inp-6aaaa-aaaaa-aaabq-cai';
			// Call authClient.login(...) to login with Internet Identity. This will open a new tab
			// with the login prompt. The code has to wait for the login process to complete.
			// We can either use the callback functions directly or wrap in a promise.
			await new Promise((resolve, reject) => {
				authClient.login({
					identityProvider: iiUrl,
					onSuccess: resolve,
					onError: reject
				});
			});
			// At this point we're authenticated, and we can get the identity from the auth client:
			identity.set(authClient.getIdentity());
			principal.set(identityValue.getPrincipal());
			// Create an actor to interact with the IC for a particular canister ID
			actor.set(createActor(canisterId, { agentOptions: { host } }));
			console.log(await crypto.getLocalUserPublicKey());
			await actorValue.set_user({
				first_name: 'Peter',
				last_name: 'Meyer',
				public_key: new Uint8Array(await crypto.getLocalUserPublicKey())
			});
			// Call the IC
			greeting = await actorValue.hello_world();
		} catch (err: unknown) {
			console.error(err);
		}
		disabled = false;
	};
</script>

<Navbar color="light" light expand="md">
	<NavbarBrand href="/">DocuTrack</NavbarBrand>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
		{#if principalValue}
			<Nav class="ms-md-3">
				<NavItem>
					{greeting}
				</NavItem>
			</Nav>
		{/if}
		<Nav class="ms-auto" navbar>
			<NavItem>
				<NavLink href="/">My Files</NavLink>
			</NavItem>
			<!-- <NavItem>
            <NavLink href="/requestFile">Request File</NavLink>
        </NavItem> -->
			<!-- <NavItem>
            <NavLink href="/activity">Activity</NavLink>
        </NavItem> -->
			<NavItem>
				<NavLink href="/requests">Requests</NavLink>
			</NavItem>
			<!-- <NavItem>
            <NavLink href="/upload">Upload File</NavLink>
        </NavItem> -->
			<NavItem>
				{#if !principalValue}
					<!-- Add link to the II login -->
					<NavLink on:click={handleOnSubmit}>Login</NavLink>
				{:else}
					<NavLink href="#">Logout</NavLink>
				{/if}
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>
