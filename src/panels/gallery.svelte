<script>
  import Record from "../svelte/components/record.svelte";
  export let iconRecords = [];
  export let onIconClick;

  $: console.log(`the count is ${iconRecords?.length}`);
</script>

<style>
  .gallery {
    max-height: 100%;
    overflow-y: auto;
    background: #ccc;
  }
</style>

<ul class="gallery icongrid" on:click={onIconClick}>
  {#each iconRecords as iconRecord}
    <Record {iconRecord} />
  {/each}
</ul>
