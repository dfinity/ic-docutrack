<script lang="ts">
  import { principal } from '$lib/shared/stores/auth.js';
  import ContentTable from '$lib/components/ContentTable.svelte';

  let principalValue;
  $: tableColumns = [{key: "name", label: "Name"}, {key: "access", label: "Access"}];
  $: tableData = [{name: "escrow_hotel_zurich.docx", access: "Only you", items: [{url: "#", text: "Open"}]}];

  principal.subscribe( value => principalValue = value);

  function getAccessibleFiles() {
    // Backend call to get all the files requested by the principal
    let accessibleFiles;
    return accessibleFiles;
  }

  function formatTableData(accessibleFiles) {
    // TODO: based on the different possible outputs from the backend, move this function to lib/utils
    // Transform the output from the backend in columns and rows
    // in order to render the Table
    let row;
    tableData.push(row);
  }

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

<svelte:head>
	<title>Home</title>
	<meta name="description" content="DokuTrack" />
</svelte:head>

<section>
  <form on:submit|preventDefault={handleOnSubmit}>
		<label for="name">Enter your name: &nbsp;</label>
		<input id="name" alt="Name" type="text" bind:value={input} {disabled} />
		<button type="submit">Click Me!</button>
	</form>

	<section id="greeting">
		{greeting}
	</section>
    <ContentTable columns={tableColumns} data={tableData}/>
</section>
