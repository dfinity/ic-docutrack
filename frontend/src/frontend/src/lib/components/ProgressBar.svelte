<script lang="ts">
  export let percent = 0;
  let className: string = "";
  export { className as class };
</script>

<div class="bg-silver overflow-hidden flex rounded-full relative {className}">
  <div
    class="bg-accent-100 h-12 transition-all ease-out"
    style="width: {percent}%;"
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin="0"
    aria-valuemax="100"
  />
  <div
    class="whitespace-nowrap absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
  >
    <slot />
  </div>
</div>
