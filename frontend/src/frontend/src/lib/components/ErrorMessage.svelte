<script lang="ts">
  let className: string = "";
  export { className as class };
</script>

<p
  class="p-6 text-accent-100 border-accent-100 border border-solid {className}"
>
  <slot />
</p>
