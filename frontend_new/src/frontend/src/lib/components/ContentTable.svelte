<script lang="ts">
  import { Table } from 'sveltestrap';
  import Submenu from '$lib/components/Submenu.svelte';
  export let columns;  // list of objects with key and label properties
  export let data;  // list of objects where the properties match the keys in columns
</script>

<Table hover>
  <thead>

    <tr>
      {#each columns as col}
        <th>{col.label}</th>
      {/each}
      {#if data && data[0] && "items" in data[0]}
        <th></th>
      {/if}
    </tr>
  </thead>
      {#if data.length > 0}
      <tbody>
    {#each data as row}
      <tr>
        {#each columns as col}
          <td>{row[col.key]}</td>
        {/each}
        <td>
          {#if "items" in row}
            <Submenu items={row.items}/>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
  {/if}
</Table>
