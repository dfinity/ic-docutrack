<script lang="ts">
  import { unreachable } from "$lib/shared/unreachable";
  import ProgressBar from "../ProgressBar.svelte";

  export let progress: {
    step: "initializing" | "downloading" | "decrypting";
    totalChunks: number;
    currentChunk: number;
  };

  let label: string;
  let percent: number;

  $: label = (() => {
    if (progress.step === "initializing") {
      return "Initializing...";
    } else if (progress.step === "downloading") {
      if (progress.totalChunks == 0) return "Downloading...";
      return `Downloading chunk ${progress.currentChunk + 1} of ${
        progress.totalChunks
      }`;
    } else if (progress.step === "decrypting") {
      return "Decrypting...";
    } else {
      return unreachable(progress.step);
    }
  })();

  $: percent = (() => {
    if (progress.step === "initializing") {
      return 0;
    } else if (progress.step === "downloading") {
      if (progress.totalChunks == 0) return 0;
      return (progress.currentChunk / progress.totalChunks) * 100;
    } else if (progress.step === "decrypting") {
      return 100;
    } else {
      return unreachable(progress.step);
    }
  })();
</script>

<ProgressBar {percent}>
  {label}
</ProgressBar>
