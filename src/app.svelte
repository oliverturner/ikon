<script>
  import { scanDroppedItems } from "./js/data";
  import { iconTree, iconDict } from "./js/store";
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
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      "a b"
      "a c";
    gap: 1rem;

    overflow: hidden;
  }

  .a {
    grid-area: a;
  }
  .b {
    grid-area: b;
    overflow: hidden;
  }
  .c {
    grid-area: c;
    overflow: hidden;
  }
</style>

<main class="app">
  <Dropzone {onDrop} label="Drop folders and SVGs here" />

  {#if scannedItems}
    {#await scannedItems}
      <Loader />
    {:then}
      <div class="content">
        <div class="a">
          <Gallery {onIconClick} />
        </div>
        <div class="b">
          <Selection />
        </div>
        <div class="c">
          <Spritesheet />
        </div>
      </div>
    {:catch error}
      <p>oops... something went awry: {error.message}</p>
    {/await}
  {/if}
</main>
