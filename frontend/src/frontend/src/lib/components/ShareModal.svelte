<script lang="ts">
  import { Icon, Button, Modal, ModalBody, ModalHeader, FormGroup, Label } from "sveltestrap";
  import { page } from "$app/stores";
  import { actor } from "$lib/shared/stores/auth.js";
  import { onMount } from "svelte";
  import SharedList from '$lib/components/SharedList.svelte'

  export let isOpen = false;
  export let fileData = {file_id: null, file_name: '', shared_with:[]};
  let oldSharedWith = fileData.shared_with.slice();
  let shareWithPerson = null;
  let users = [];
  const toggle = () => (isOpen = !isOpen);
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
      fileData.shared_with = fileData.shared_with;
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
    for(let i = 0; i < sharedUsers.length; i++) {
      if(actorValue) {
        // TODO: Add encryption to key
        await actorValue.share_file(sharedUsers[i].ic_principal, fileData.file_id, sharedUsers[i].public_key);
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

  async function setShareList() {

  }
</script>

<div>
  <Modal {isOpen} {toggle}>
    <ModalHeader {toggle}>Share "{fileData.file_name}"</ModalHeader>
    <ModalBody>
      <form class="form-floating" on:submit|preventDefault={setShareList}>
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
          <Button on:click={addPersonToShare} color="secondary">Add</Button>
        </FormGroup>
        <FormGroup>
          <Button on:click={saveShare} color="primary">Save Changes</Button>
        </FormGroup>
      </form>
    </ModalBody>
  </Modal>
</div>
