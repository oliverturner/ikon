<script>
  import Loader from "../loader.svelte";
  import Record from "../record.svelte";

  /** @type IconRecord[] */
  export let iconRecords = [];
  export let showSpinner = false;
  export let onIconClick;
</script>

<style>
  .gallery {
    background: #ccc;
  }
</style>

{#if showSpinner}
  <Loader />
{/if}

{#if iconRecords.length > 0}
  <ul class="gallery icongrid" on:click={onIconClick}>
    {#each iconRecords as iconRecord}
      <Record {iconRecord} />
    {/each}
  </ul>
{/if}
