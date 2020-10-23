<script>
  import { scanDroppedItems } from "../js/data";
  import Content from "./content.svelte";
  import Dropzone from "./panels/dropzone.svelte";
  import Gallery from "./panels/gallery.svelte";
  import Selection from "./panels/selection.svelte";
  import Loader from "./components/loader.svelte";

  let selectedRecords = [];

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

    overflow: hidden;
    height: 100vh;
    padding: 0.5rem;
  }
</style>

<main class="app">
  <Dropzone {onDrop} />

  {#await scannedItems}
    <Loader />
  {:then { iconRecords }}
    <Content>
      <slot slot="gallery">
        <Gallery {iconRecords} {onIconClick} />
      </slot>
      <slot slot="selection">
        <Selection {selectedRecords} />
      </slot>
    </Content>
  {:catch error}
    <p>oops... something went awry: {error}</p>
  {/await}
</main>
