<script lang="ts">
  import { Button, Modal, ModalBody, ModalHeader } from "sveltestrap";
  import { page } from "$app/stores";

  export let isOpen = false;
  const toggle = () => (isOpen = !isOpen);

  import { actor } from "$lib/shared/stores/auth.js";
  import { createActor } from "../../../../declarations/backend";
  import { default as crypto } from "$lib/crypto";

  let actorValue: object;
  let requestLink: URL;
  let loading: boolean = false;

  actor.subscribe((value) => (actorValue = value));

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
      const alias = await actorValue.request_file(data.requestName);
      requestLink = new URL($page.url.origin + "/upload");
      requestLink.searchParams.append("alias", alias);
    }
    loading = false;
  }

  function copyText() {
    var copyText = "";
    if (requestLink) {
      copyText = requestLink;
    }
    navigator.clipboard.writeText(copyText);
    // Alert the copied text
    alert("Copied!");
  }
</script>

<div>
  <Button color="default" on:click={toggle}>Create new request</Button>
  <Modal {isOpen} {toggle}>
    <ModalHeader {toggle}>Create Request</ModalHeader>
    <ModalBody>
      <form class="form-floating" on:submit|preventDefault={updateRequestUrl}>
        <div class="form-floating mb-3">
          <input
            type="text"
            required={true}
            class="form-control"
            id="requestName"
            placeholder="Enter your input"
            name="requestName"
          />
          <label for="requestName">Request Name</label>
        </div>
        <div class="form-floating mb-3">
          {#if requestLink}
            <input
              type="text"
              class="form-control"
              id="requestLink"
              placeholder=""
              name="requestLink"
              value={requestLink}
              readonly
            />
            <span>
              <a
                href="mailto:?subject=Share your file&body=Please share a file with me here: {requestLink}"
                >Email me!</a
              >
            </span>
          {:else}
            <input
              type="text"
              class="form-control"
              id="requestLink"
              placeholder=""
              name="requestLink"
              readonly
            />
          {/if}
          <label for="requestLink">Request Link</label>
        </div>
        <div class="form-floating mb-3">
          <button
            class="btn btn-outline-secondary"
            type="button"
            on:click={copyText}>Copy Link</button
          >
          {#if loading}
            <button type="submit" class="btn btn-primary" disabled
              >Loading</button
            >
          {:else if !loading && requestLink}
            <button type="submit" class="btn btn-primary" disabled
              >Submit</button
            >
          {:else}
            <button type="submit" class="btn btn-primary">Submit</button>
          {/if}
        </div>
      </form>
    </ModalBody>
  </Modal>
</div>
