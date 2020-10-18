<script>
  import Dropzone from "./components/dropzone.svelte";
  import Gallery from "./components/gallery.svelte";
  
  let fileDict = new Map();
  let showSpinner = false;

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
  <Dropzone />
  <Gallery {showSpinner} {onIconClick} />
</main>
