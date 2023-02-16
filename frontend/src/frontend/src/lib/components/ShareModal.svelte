<script lang="ts">
  import { Button, Modal, ModalBody, ModalHeader, FormGroup, Label } from "sveltestrap";
  import { actor } from "$lib/shared/stores/auth.js";
  import { onMount } from "svelte";
  import {default as crypto} from "$lib/crypto";
  import SharedList from '$lib/components/SharedList.svelte'

  export let isOpen = false;
  export let fileData = {file_id: null, file_name: '', shared_with:[]};


  let shareWithPerson = null;
  let users = [];
  let oldSharedWith = [];
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
    let res = users.find(obj => {return obj.ic_principal === shareWithPerson});

    if(res !== null && !fileData.shared_with.includes(res)) {
      fileData.shared_with.push(res);
      // Assign to itself for reactivity purposes
      fileData = fileData;
    }
  }

  function removePersonFromShare(principal) {
    let user = users.find(obj => {return obj.ic_principal === principal});
    if(user !== null && fileData.shared_with.includes(user)) {
      fileData.shared_with = removeItem(fileData.shared_with, user);
      // Assign to itself for reactivity purposes
      fileData = fileData;
    }
  }

  async function saveShare() {
    let sharedUsers = fileData.shared_with;
    const documentKey = await crypto.decryptForUser(fileData.file_status.uploaded.document_key.buffer);
    for(let i = 0; i < sharedUsers.length; i++) {
      if(actorValue) {
        const encryptedFileKey = await crypto.encryptForUser(documentKey, sharedUsers[i].public_key.buffer);
        await actorValue.share_file(sharedUsers[i].ic_principal, fileData.file_id, encryptedFileKey);
      }
    }
    // Go over all old entries and remove the ones that are no longer in the shared list
    for(let i = 0; i < oldSharedWith.length; i++) {
      let res = fileData.shared_with.find(obj => {return obj.ic_principal === oldSharedWith[i].ic_principal});
      if(!res) {
        await actorValue.revoke_share(oldSharedWith[i].ic_principal, fileData.file_id);
      }
    }
    isOpen = false;
  }

  function onOpen(isOpen) {
    if(isOpen){
    oldSharedWith = fileData.shared_with.slice();
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
          <SharedList {users} sharedWithList={fileData.shared_with} removeUser={removePersonFromShare} />
      </FormGroup>
        <FormGroup>
          <select bind:value={shareWithPerson} class="form-select">
            {#each users as user}
              <option value={user.ic_principal}>{user.first_name} {user.last_name}</option>
            {/each}
          </select>
        </FormGroup>
        <FormGroup class="mb-4">
          <Button type="button" on:click={addPersonToShare} color="secondary">Add</Button>
        </FormGroup>
        <FormGroup>
          <Button type="submit" color="primary">Save Changes</Button>
        </FormGroup>
      </form>
    </ModalBody>
  </Modal>
</div>
