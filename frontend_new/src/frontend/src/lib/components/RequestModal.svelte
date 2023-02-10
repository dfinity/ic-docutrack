<script>
	import {
		Button,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Form,
		FormGroup,
		Input,
		Label
	} from 'sveltestrap';

	export let isOpen = false;
	const toggle = () => (isOpen = !isOpen);

	import { actor } from '$lib/shared/stores/auth.js';

	let actorValue;
	let requestName;
	let requestUrl;

	actor.subscribe((value) => (actorValue = value));

	async function updateRequestUrl(e) {
		const formData = new FormData(e.target);
		// Do not request new url when there is already one
		const data = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}
		if (data.requestName || !data.requestLink) return;
		requestUrl = await actor.request_file(data.request_name);
		// Update request view
	}
</script>

<div>
	<Button color="default" on:click={toggle}>Create new request</Button>
	<Modal {isOpen} {toggle}>
		<ModalHeader {toggle}>Create Request</ModalHeader>
		<Form>
			<ModalBody>
				<div class="mb-3">
					<label for="requestName" class="form-label">Request Name</label>
					<input type="text" class="form-control" id="requestName" bind:value={requestName} />
				</div>
				<div class="mb-3">
					<label for="requestLink" class="form-label">Request Link</label>
					<input class="form-control" id="requestLink" bind:value={requestUrl} readonly />
				</div>
			</ModalBody>
			<ModalFooter>
				{#if requestUrl}
					<Button color="primary" on:click={toggle}>Close</Button>
				{:else}
					<Button color="primary" type="submit" on:click={updateRequestUrl}>Create Request</Button>
				{/if}
			</ModalFooter>
		</Form>
	</Modal>
</div>
