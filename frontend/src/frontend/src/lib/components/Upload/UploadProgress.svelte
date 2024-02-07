<script lang="ts">
  import ProgressBar from "../ProgressBar.svelte";

  export let percent: number = 0;
  export let speed: number = 0;
  export let transferred: number = 0;
  export let total: number = 0;
</script>

<ProgressBar {percent}>
  {(transferred / 1024 / 1024).toFixed(2)} MB / {(total / 1024 / 1024).toFixed(
    2,
  )} MB at
  {(speed / 1024 / 1024).toFixed(2)} MB/s
</ProgressBar>
