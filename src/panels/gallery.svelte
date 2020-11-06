<script>
  import Record from "../components/record.svelte";
  import Icon from "../components/icon.svelte";
  import { iconTree, filteredIconList, searchTerm } from "../js/store";

  export let onIconClick;

  let preserveDirs = true;

  $: togglableDirs = $searchTerm.length === 0;
</script>

<style>
  .panel {
    grid-template-rows: auto 1fr auto;
  }
  .gallery {
    height: 100%;
    overflow-y: auto;
    border: none;
  }

  .control {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .searchbar {
    flex: 1;

    display: flex;
  }
  .searchfield {
    flex: 1;
    padding: 0.5rem;
  }
</style>

<div class="panel">
  <div class="controls controls--header">
    <div class="control searchbar">
      <label for="searchfield">Search:</label>
      <input
        id="searchfield"
        class="searchfield"
        type="search"
        bind:value={$searchTerm} />
    </div>
  </div>
  <div class="gallery icongrid" on:click={onIconClick}>
    {#if preserveDirs && togglableDirs}
      {#each $iconTree as iconRecord (iconRecord)}
        <Record {iconRecord} />
      {/each}
    {:else}
      {#each $filteredIconList as iconRecord (iconRecord)}
        <Icon {iconRecord} />
      {/each}
    {/if}
  </div>

  <div class="controls controls--footer">
    {#if togglableDirs}
      <div class="control">
        <input id="collapse" type="checkbox" bind:checked={preserveDirs} />
        <label for="collapse">Preserve directories</label>
      </div>
    {:else}
      {@html '&nbsp;'}
    {/if}
  </div>
</div>
