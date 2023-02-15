<script lang="ts">
  import { Table } from "sveltestrap";
  import Submenu from "$lib/components/Submenu.svelte";
  export let columns; // list of objects with key and label properties
  export let data; // list of objects where the properties match the keys in columns
</script>

{#if data.length > 0}
  <Table hover>
    <thead>
      <tr>
        {#each columns as col}
          <th>{col.label}</th>
        {/each}
        {#if "items" in data[0]}
          <th />
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each data as row}
        <tr>
          {#each columns as col}
            <td>{row[col.key]}</td>
          {/each}
          <td>
            {#if "items" in row}
              <Submenu items={row.items} />
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
{:else}
  <h3>No data available at the moment</h3>
{/if}
