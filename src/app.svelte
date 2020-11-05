<script>
  import { scanDroppedItems } from "./js/data";
  import { iconTree, iconDict } from "./js/store";
  import Dropzone from "./panels/dropzone.svelte";
  import Gallery from "./panels/gallery.svelte";
  import Selection from "./panels/selection.svelte";
  import Spritesheet from "./panels/spritesheet.svelte";
  import Content from "./components/content.svelte";
  import Loader from "./components/loader.svelte";

  let scannedItems;

  function parseDroppedItems(items) {
    scannedItems = undefined;
    return scanDroppedItems(items).then(({ iconRecords, fileDict }) => {
      iconTree.set(iconRecords);
      iconDict.set(fileDict);
    });
  }

  /**
   * @param {DragEvent} event
   */
  function onDrop(event) {
    event.preventDefault();
    scannedItems = parseDroppedItems([...event.dataTransfer.items]);
  }

  /**
   * @param {MouseEvent} event
   */
  function onIconClick(event) {
    const item = event.target.closest("[data-key]");
    if (item) {
      iconDict.select(item.dataset.key);
    }
  }
</script>

<style>
  .app {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 0.5rem;

    overflow: hidden;
    height: 100vh;
    padding: 0.5rem;
  }
</style>

<main class="app">
  <Dropzone {onDrop} label="Drop folders and SVGs here" />

  {#if scannedItems}
    {#await scannedItems}
      <Loader />
    {:then}
      <Content>
        <div slot="gallery">
          <Gallery {onIconClick} />
        </div>
        <div slot="selection">
          <Selection {onIconClick} />
        </div>
        <div slot="spritesheet">
          <Spritesheet />
        </div>
      </Content>
    {:catch error}
      <p>oops... something went awry: {error.message}</p>
    {/await}
  {/if}
</main>
