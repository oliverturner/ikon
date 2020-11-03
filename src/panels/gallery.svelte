<script>
  import Record from "../components/record.svelte";
  import { iconTree } from "../js/store";

  export let onIconClick;
</script>

<style>
  .gallery {
    min-width: 0;
    max-height: 100%;
    overflow-y: auto;
    background: #ccc;
  }
</style>

<ul class="gallery icongrid" on:click={onIconClick}>
  {#each $iconTree as iconRecord}
    <Record {iconRecord} />
  {/each}
</ul>
