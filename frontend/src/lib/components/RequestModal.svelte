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
      Label,
    } from 'sveltestrap';

    export let isOpen = false;
    const toggle = () => (isOpen = !isOpen);

    let requestName = '';
    let requestUrl = '';

    function updateRequestUrl() {
        // Do not request new url when there is already one
        if(requestUrl || !requestName) return;
        // TODO: Implement backend request
        // requestUrl = ...
        // Update request view
    }
  </script>
  
  <div>
    <Button color="default" on:click={toggle}>Create new request</Button>
    <Modal isOpen={isOpen} {toggle}>
      <ModalHeader {toggle}>Create Request</ModalHeader>
      <ModalBody>
        <Form>
            <div class="mb-3">
                <label for="requestName" class="form-label">Request Name</label>
                <input type="text" class="form-control" id="requestName" bind:value={requestName}>
            </div>
            <div class="mb-3">
            <label for="requestLink" class="form-label">Request Link</label>
            <input class="form-control" id="requestLink" bind:value={requestUrl} readonly>
            </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        {#if requestUrl}
            <Button color="primary" on:click={toggle}>Close</Button>
        {:else}
            <Button color="primary" on:click={updateRequestUrl}>Create Request</Button>
        {/if}
      </ModalFooter>
    </Modal>
  </div>
  