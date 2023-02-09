<script lang="ts">
	import { createActor } from '../../../declarations/backend';
	import { HttpAgent } from '@dfinity/agent';
	import { AuthClient } from '@dfinity/auth-client';

	let input = '';
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
			const identity = authClient.getIdentity();
			console.log(identity);
			console.log(identity.getPrincipal());

			// Create an actor to interact with the IC for a particular canister ID
			const actor = createActor(canisterId, { agentOptions: { host } });

			// Call the IC
			greeting = await actor.hello_world();
		} catch (err: unknown) {
			console.error(err);
		}

		disabled = false;
	};
</script>

<main>
	<img src="logo2.svg" alt="DFINITY logo" />
	<br />
	<br />

	<form on:submit|preventDefault={handleOnSubmit}>
		<label for="name">Enter your name: &nbsp;</label>
		<input id="name" alt="Name" type="text" bind:value={input} {disabled} />
		<button type="submit">Click Me!</button>
	</form>

	<section id="greeting">
		{greeting}
	</section>
</main>

<style lang="scss">
	img {
		max-width: 50vw;
		max-height: 25vw;
		display: block;
		margin: auto;
	}

	form {
		display: flex;
		justify-content: center;
		gap: 0.5em;
		flex-flow: row wrap;
		max-width: 40vw;
		margin: auto;
		align-items: baseline;
		font-family: sans-serif;
		font-size: 1.5rem;
	}

	button[type='submit'] {
		padding: 5px 20px;
		margin: 10px auto;
		float: right;
	}

	#greeting {
		margin: 10px auto;
		padding: 10px 60px;
		border: 1px solid #222;
	}

	#greeting:empty {
		display: none;
	}
</style>
