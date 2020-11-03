<script>
  import { scanDroppedItems } from "./js/data";
  import { iconTree, iconDict } from "./js/store";
  import Content from "./panels/content.svelte";
  import Dropzone from "./panels/dropzone.svelte";
  import Gallery from "./panels/gallery.svelte";
  import Selection from "./panels/selected-icons.svelte";
  import Spritesheet from "./panels/selected-spritesheet.svelte";
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
  async function onDrop(event) {
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
        <slot slot="gallery">
          <Gallery {onIconClick} />
        </slot>
        <slot slot="selection">
          <div>
            <Selection />
            <Spritesheet />
          </div>
        </slot>
      </Content>
    {:catch error}
      <p>oops... something went awry: {error.message}</p>
    {/await}
  {/if}
</main>
