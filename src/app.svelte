<script>
  import Dropzone from "./components/dropzone.svelte";
  import Loader from "./components/loader.svelte";
  import Gallery from "./components/gallery.svelte";
  import { scanDroppedItems } from "./js/data";

  let scannedItems = Promise.resolve({
    iconRecords: [],
    fileDict: new Map(),
  });

  /**
   * @param {DragEvent} event
   */
  async function onDrop(event) {
    event.preventDefault();
    scannedItems = scanDroppedItems([...event.dataTransfer.items]);
  }

  /**
   * @param {MouseEvent} event
   */
  function onIconClick(event) {
    const item = event.target.closest("li");
    if (item) {
      console.log("record", scannedItems.fileDict.get(item.dataset.iconKey));
    }
  }
</script>

<style>
  .app {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 0.5rem;

    height: 100vh;
    margin: 0.5rem;
  }
</style>

<main class="app">
  <Dropzone {onDrop} />

  {#await scannedItems}
    <Loader />
  {:then { iconRecords }}
    <Gallery {iconRecords} {onIconClick} />
  {:catch error}
    <p>oops... something went awry: {error}</p>
  {/await}
</main>
