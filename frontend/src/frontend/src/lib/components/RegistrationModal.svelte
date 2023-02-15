<script lang="ts">
  import { Button, Modal, ModalBody, ModalHeader } from "sveltestrap";
  import { page } from "$app/stores";

  export let isOpen = false;
  const toggle = () => (isOpen = !isOpen);

  import {
    actor,
    firstName,
    lastName,
    isAuthenticated,
  } from "$lib/shared/stores/auth.js";
  import { createActor } from "../../../../declarations/backend";
  import { default as crypto } from "$lib/crypto";

  let actorValue: object;
  let requestName: string;
  let requestLink: URL;
  let loading: boolean = false;

  actor.subscribe((value) => (actorValue = value));

  async function setUser(e) {
    const formData = new FormData(e.target);
    const data: any = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    await actorValue.set_user({
      first_name: data.firstName,
      last_name: data.lastName,
      public_key: new Uint8Array(await crypto.getLocalUserPublicKey()),
    });
    firstName.set(data.firstName);
    lastName.set(data.lastName);
    isOpen = false;
  }
</script>

<div>
  <Modal {isOpen} {toggle}>
    <ModalHeader {toggle}>Register Yourself</ModalHeader>
    <ModalBody>
      <form class="form-floating" on:submit|preventDefault={setUser}>
        <p>
          Your Internet Identity is not connected with a name yet. Enter your
          name to setup an account on DocuTrack.
        </p>
        <div class="form-floating mb-3">
          <input
            type="text"
            required={true}
            class="form-control"
            id="firstName"
            name="firstName"
            placeholder=""
          />
          <label for="firstName">First Name</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="text"
            required={true}
            class="form-control"
            id="lastName"
            name="lastName"
            placeholder=""
          />
          <label for="lastName">Last Name</label>
        </div>
        <div class="form-floating mb-3">
          <button type="submit" class="btn btn-primary">Submit</button>
        </div>
      </form>
    </ModalBody>
  </Modal>
</div>
