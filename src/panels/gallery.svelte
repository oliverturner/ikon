<script>
  import Record from "../components/record.svelte";
  import Icon from "../components/icon.svelte";
  import { iconTree, iconList } from "../js/store";

  export let onIconClick;

  let preserveDirs = true;

  const getKey = ({ id }) => `gallery-${id}`;
</script>

<style>
  .panel {
    display: grid;
    grid-template-rows: 1fr auto;

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
</style>

<div class="panel">
  <ul class="gallery icongrid" on:click={onIconClick}>
    {#if preserveDirs}
      {#each $iconTree as iconRecord (getKey(iconRecord))}
        <Record {iconRecord} />
      {/each}
    {:else}
      {#each $iconList as iconRecord (getKey(iconRecord))}
        <Icon {iconRecord} />
      {/each}
    {/if}
  </ul>

  <div class="controls">
    <div class="control">
      <input id="collapse" type="checkbox" bind:checked={preserveDirs} />
      <label for="collapse">Preserve directories</label>
    </div>
  </div>
</div>
