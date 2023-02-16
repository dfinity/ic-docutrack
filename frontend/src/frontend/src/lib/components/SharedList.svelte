<script>
    import { Icon } from "sveltestrap";

    export let sharedWithList;
    export let removeUser = () => {};
</script>

<div>
    {#each sharedWithList as user}
        <span class="badge rounded-pill bg-primary me-2 mb-2">
            {user.first_name} {user.last_name} <span on:click={() => (removeUser(user.ic_principal))}><Icon name="dash-circle" /></span>
        </span>
    {/each}
</div>