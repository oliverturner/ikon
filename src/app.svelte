<script>
  import Dropzone from "./components/dropzone.svelte";
  import Gallery from "./components/gallery.svelte";
  import { scanDroppedItems } from "./js/data";

  /** @type {IconRecord[]} */
  let iconRecords = [];
  let fileDict = new Map();
  let showSpinner = false;

  /**
   * @param {DragEvent} event
   */
  async function onDrop(event) {
    event.preventDefault();

    iconRecords = [];
    fileDict = new Map();
    showSpinner = true;

    try {
      [iconRecords, fileDict] = await scanDroppedItems([...event.dataTransfer.items]);
      showSpinner = false;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @param {MouseEvent} event
   */
  function onIconClick(event) {
    const item = event.target.closest("li");
    if (item) {
      console.log("record", fileDict.get(item.dataset.iconKey));
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
  <Gallery {iconRecords} {showSpinner} {onIconClick} />
</main>
