<script>
    import {
      Collapse,
      Navbar,
      NavbarToggler,
      NavbarBrand,
      Nav,
      NavItem,
      NavLink,
    } from 'sveltestrap';


    import { principal, firstName } from '$lib/shared/stores/auth.js';
    
    let principalValue;
    let firstNameValue;

    principal.subscribe( value => principalValue = value);
    firstName.subscribe( value => firstNameValue = value);
  
    let isOpen = false;
    
    function handleUpdate(event) {
      isOpen = event.detail.isOpen;
    }
  </script>
<Navbar color="light" light expand="md">
    <NavbarBrand href="/">DocuTrack</NavbarBrand>
    <NavbarToggler on:click={() => (isOpen = !isOpen)} />
    <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
      {#if firstNameValue}
        <Nav class="ms-md-3">
          <NavItem>
              Hi, {firstNameValue}
          </NavItem>
        </Nav>
      {/if}
      <Nav class="ms-auto" navbar>
        <NavItem>
          <NavLink href="/">My Files</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="/activity">Activity</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="/requests">Requests</NavLink>
        </NavItem>
        <NavItem>
            <NavLink href="/upload">Upload File</NavLink>
        </NavItem>
        <NavItem>
            {#if principal}
            <!-- Add link to the II login -->
            <NavLink href="#">Login</NavLink>
            {:else}
            <NavLink href="#">Logout</NavLink>
            {/if}
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>
