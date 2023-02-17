<script lang="ts">
  import { Button, Modal, ModalBody, ModalHeader, FormGroup, Label, Input } from "sveltestrap";
  import { actor } from "$lib/shared/stores/auth.js";
  import { onMount } from "svelte";
  import {default as crypto} from "$lib/crypto";
  import SharedList from '$lib/components/SharedList.svelte'

  export let isOpen = false;
  export let fileData = {file_id: null, file_name: '', shared_with:[]};

  let shareWithPerson = null;
  let expirationDate = null;
  let users = [];
  let oldSharedWith = [];
  let newSharedWith = [];
  let hasExpirationDate = false;
  const toggle = () => {
    isOpen = !isOpen;
  };
  let actorValue: object;
  actor.subscribe((value) => (actorValue = value));

  function removeItem(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

  function addPersonToShare() {
    if(shareWithPerson){
    let res = users.find(obj => 
      obj.ic_principal.compareTo(shareWithPerson) === 'eq'
    );
    if(res !== null && !newSharedWith.find(obj => obj.ic_principal.compareTo(shareWithPerson) === 'eq')) {
      newSharedWith.push(res);
      // Assign to itself for reactivity purposes
      newSharedWith = newSharedWith;
    }
  }
  }

  function removePersonFromShare(principal) {
    let user = newSharedWith.find(obj => obj.ic_principal.compareTo(principal) === 'eq');
    if(user !== null) {
      newSharedWith = removeItem(newSharedWith, user);
      // Assign to itself for reactivity purposes
      newSharedWith = newSharedWith;
    }
  }

  async function saveShare() {
    // If no expiration date is used, set to -1
    let timestamp = -1;
    if(hasExpirationDate && expirationDate) {
    // The expiration date is saved as timestamp in nanoseconds, convert accordingly
    timestamp = Date.parse(expirationDate) * 1e6;
    }
    const documentKey = await crypto.decryptForUser(fileData.file_status.uploaded.document_key.buffer);
    for(let i = 0; i < newSharedWith.length; i++) {
      if(actorValue) {
        const encryptedFileKey = await crypto.encryptForUser(documentKey, newSharedWith[i].public_key.buffer);
        // TODO: add expiration date to backend call
        await actorValue.share_file(newSharedWith[i].ic_principal, fileData.file_id, new Uint8Array(encryptedFileKey));
      }
    }
    // Go over all old entries and remove the ones that are no longer in the shared list
    for(let i = 0; i < oldSharedWith.length; i++) {
      let res = newSharedWith.find(obj => obj.ic_principal.compareTo(oldSharedWith[i].ic_principal) === 'eq');
      if(!res) {
        await actorValue.revoke_share(oldSharedWith[i].ic_principal, fileData.file_id);
      }
    }
    // Write back the new state, so the the UI updates
    fileData.shared_with = newSharedWith.slice();
    isOpen = false;
  }

  function onOpen(isOpen) {
    if(isOpen){
      // Keep the old version of the shared users
      oldSharedWith = fileData.shared_with.slice();
      // Copy the array and modify this list with the UI
      newSharedWith = fileData.shared_with.slice();
    }
  }

  // We want to ensure that `oldSharedWith` is only updated at the beginning of a new sharing
  $: onOpen(isOpen);

  onMount(async () => {
    if(actorValue) {
      let res = await actorValue.get_users();
      if('users' in res) {
        users = res.users;
      } else {
        users = [];
      }
    }
  });
</script>

<div>
  <Modal {isOpen} {toggle}>
    <ModalHeader {toggle}>Share "{fileData.file_name}"</ModalHeader>
    <ModalBody>
      <form class="form-floating" on:submit|preventDefault={saveShare}>
        <p>
          Choose the people that have access to this file.
        </p>
        <FormGroup>
          <Label for="sharedWith">Shared with:</Label>
          <SharedList sharedWithList={newSharedWith} removeUser={removePersonFromShare} />
      </FormGroup>
        <FormGroup>
          <select bind:value={shareWithPerson} class="form-select">
            {#each users as user}
              <option value={user.ic_principal}>{user.first_name} {user.last_name}</option>
            {/each}
          </select>
        </FormGroup>
        <FormGroup>
          <Button type="button" on:click={addPersonToShare} color="secondary">Add</Button>
        </FormGroup>
        <FormGroup class="mb-4">
          <Input id="c1" type="switch" label="Set Expiration Date?" bind:checked={hasExpirationDate} />
          <Input id="expirationDate" class="form-control" type="date"  bind:value={expirationDate} disabled={!hasExpirationDate} required={hasExpirationDate}/>
        </FormGroup>
        <FormGroup>
          <Button type="submit" color="primary">Save Changes</Button>
        </FormGroup>
      </form>
    </ModalBody>
  </Modal>
</div>
