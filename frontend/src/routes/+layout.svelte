<script>
	import {Container} from 'sveltestrap';
	import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="app">
	<Navbar />
	<Container class="pt-4">
		<slot />
	</Container>
</div>
