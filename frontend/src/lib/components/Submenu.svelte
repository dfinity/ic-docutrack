<script>
  import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Icon,
  } from 'sveltestrap';

  /* A list containing the dropdown items as objects. Each object has the attributes `text`, 
     which contains the displayed text, and `url` that contains the link 
     to the option. 
  */
  export let items;
</script>

<Dropdown>
  <DropdownToggle tag="div" class="d-inline-block"><Icon name="three-dots" /></DropdownToggle>
  <DropdownMenu>
    {#each items as item}
      <DropdownItem href={item.url}>{item.text}</DropdownItem>
    {/each}
  </DropdownMenu>
</Dropdown>
