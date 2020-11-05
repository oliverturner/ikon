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
    display: grid;
    grid-template-rows: auto 1fr auto;

    overflow: hidden;
    height: 100%;
    border: 1px solid var(--dir-border);
    border-radius: var(--border-radius);
  }
  .gallery {
    height: 100%;
    overflow-y: auto;
    border: none;
    background: #ccc;
  }

  .control {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .searchbar {
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
