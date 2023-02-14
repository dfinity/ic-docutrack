<script lang="ts">
	import ContentTable from '$lib/components/ContentTable.svelte';
	import { actor, authClient } from '$lib/shared/stores/auth.js';
	import { createActor } from '../../../declarations/backend';
	import { AuthClient } from '@dfinity/auth-client';
	import { onMount } from 'svelte';

	let data = [];

	let actorValue;
	let authClientValue;

	actor.subscribe((value) => (actorValue = value));
	authClient.subscribe((value) => (authClientValue = value));

	let tableColumns = [
		{ key: 'name', label: 'Name' },
		{ key: 'access', label: 'Access' }
	];

	onMount(async () => {
		authClient.set(await AuthClient.create());
		const isAuthenticated = await authClientValue.isAuthenticated();
		if (isAuthenticated) {
			// Canister IDs are automatically expanded to .env config - see vite.config.ts
			const canisterId = import.meta.env.VITE_BACKEND_CANISTER_ID;
			// We pass the host instead of using a proxy to support NodeJS >= v17 (ViteJS issue: https://github.com/vitejs/vite/issues/4794)
			const host = import.meta.env.VITE_HOST;
			actor.set(createActor(canisterId, { agentOptions: { host } }));
		
		const fileData = await actorValue.get_files();
		console.log('Table data: ', fileData);
		// Prepare data for page template
		for (let idx = 0; idx < fileData.length; ++idx) {
			data.push({
				name: fileData[idx].file_name,
				access: 'Only You',
				items: [{ url: '/details/' + fileData[idx].file_id, text: 'Open' }]
			});
		}
		data = data;
		console.log('preprocessed data: ', data);
	}
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="DokuTrack" />
</svelte:head>

<section>
	<ContentTable columns={tableColumns} {data} />
</section>
