<script>
  import Loader from "./loader.svelte";
  import Record from "./record.svelte";
  import { iconRecords } from "../js/stores";

  export let showSpinner = false;
  export let onIconClick;

  $: console.log(`the count is ${$iconRecords.length}`);
</script>

<style>
  .gallery {
    background: #ccc;
  }
</style>

{#if showSpinner}
  <Loader />
{/if}

{#if $iconRecords.length > 0}
  <ul class="gallery icongrid" on:click={onIconClick}>
    {#each $iconRecords as iconRecord}
      <Record {iconRecord} />
    {/each}
  </ul>
{/if}
