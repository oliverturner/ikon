<script>
  import Dropzone from "./dropzone.svelte";
  import Gallery from "./gallery.svelte";
  import { scanDroppedItems } from "../js/data";

  /** @type {IconRecord[]} */
  let iconRecords = [];
  let showSpinner = false;

  $: console.log(`the count is ${iconRecords.length}`);

  /**
   * @param {DragEvent} event
   */
  async function onDrop(event) {
    event.preventDefault();

    showSpinner = true;

    try {
      iconRecords = await scanDroppedItems([...event.dataTransfer.items]);
      showSpinner = false;
    } catch (error) {
      console.log(error);
    }
  }

  function onIconClick(event) {
    const item = event.target.closest("li");
    if (item) {
      console.log(item.dataset.iconKey);
    }
  }
</script>

<style>
  .app {
    display: grid;
    gap: 0.5rem;

    margin: 0.5rem;
  }
</style>

<main class="app">
  <Dropzone {onDrop} />
  <Gallery {iconRecords} {showSpinner} {onIconClick} />
</main>
