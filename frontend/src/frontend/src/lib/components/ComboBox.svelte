<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  export let items: { label: string; value: any }[];
  export let placeholder: string;
  export let notFoundMessage: string;
  export let disabled = false;
  export let id = "";

  let filteredValues: typeof items = [];
  let container: HTMLDivElement;
  let selectionIndex = 0;
  let currentSearchTerm: string = "";
  let dropdownShown = false;

  const dispatch = createEventDispatcher<{
    select: {
      label: string;
      value: any;
    };
  }>();

  $: {
    if (currentSearchTerm.length > 0) {
      dropdownShown = true;
    }
  }

  $: {
    if (disabled) {
      dropdownShown = false;
    }
  }

  $: {
    if (items.length > 0 && items.length <= selectionIndex) {
      selectionIndex = items.length - 1;
    }
  }

  $: {
    if (currentSearchTerm.trim().length > 0) {
      filteredValues = items.filter((item) =>
        // item.label.toLowerCase().includes(currentSearchTerm.toLowerCase()),
        item.label.toLowerCase().startsWith(currentSearchTerm.toLowerCase()),
      );
      // .slice(0, maxItems);
    } else {
      filteredValues = [...items];
    }

    filteredValues.sort((a, b) => a.label.localeCompare(b.label));
  }

  function clickOutside(event: MouseEvent) {
    if (!container.contains(event.target as Node)) {
      dropdownShown = false;
    }
  }

  function clear() {
    currentSearchTerm = "";
  }

  onMount(() => {
    window.addEventListener("click", clickOutside);
  });

  onDestroy(() => {
    window.removeEventListener("click", clickOutside);
  });

  function scrollIntoView(index: number) {
    container
      .querySelector("div li:nth-of-type(" + (index + 1) + ")")
      ?.scrollIntoView({
        block: "nearest",
        inline: "start",
      });

    // el.scrollIntoView()
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (filteredValues !== null && filteredValues.length > 0) {
        dispatch("select", filteredValues[selectionIndex]);
        clear();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredValues !== null && filteredValues.length > 0) {
        if (selectionIndex === 0) {
          selectionIndex = filteredValues.length - 1;
        } else {
          selectionIndex -= 1;
        }
        scrollIntoView(selectionIndex);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredValues !== null && filteredValues.length > 0) {
        selectionIndex = (selectionIndex + 1) % filteredValues.length;
        scrollIntoView(selectionIndex);
      }
    } else if (e.key === "Escape") {
      // clear();
      dropdownShown = false;
      e.preventDefault();
    }
  }

  function onInput() {
    selectionIndex = 0;
  }
</script>

<div class="relative" bind:this={container}>
  <input
    {id}
    on:keydown={onKeydown}
    on:blur={clear}
    on:input={onInput}
    on:focus={() => (dropdownShown = true)}
    bind:value={currentSearchTerm}
    type="text"
    class="input"
    {disabled}
    {placeholder}
  />
  {#if dropdownShown}
    <div
      class="absolute bg-white py-4 z-10 drop-shadow-xl border-silver border-solid border rounded-md w-full max-h-[200px] overflow-auto"
      on:mousedown|stopPropagation|preventDefault
      on:pointerdown|stopPropagation|preventDefault
    >
      {#if filteredValues.length === 0}
        <div class="px-4 py-2 text-center text-title-2 text-accent-200">
          <!-- {#if items.length > 0} -->
          {notFoundMessage}
          <!-- {/if} -->
        </div>
      {:else}
        <ul class="w-full">
          {#each filteredValues as item, index}
            <li>
              <button
                tabindex="-1"
                type="button"
                class="px-4 py-2 hover:bg-black/10 w-full text-left text-title-2 font-sans {index ===
                selectionIndex
                  ? 'bg-black/10'
                  : ''}"
                on:click={() => dispatch("select", item)}>{item.label}</button
              >
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>
