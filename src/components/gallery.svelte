<script>
  import Record from "./record.svelte";
  export let iconRecords;
  export let onIconClick;

  $: console.log(`the count is ${iconRecords?.length}`);
</script>

<style>
  .gallery {
    background: #ccc;
  }
</style>

{#if iconRecords?.length}
  <ul class="gallery icongrid" on:click={onIconClick}>
    {#each iconRecords as iconRecord}
      <Record {iconRecord} />
    {/each}
  </ul>
{/if}
