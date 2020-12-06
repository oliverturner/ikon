<script>
  import { onMount } from "svelte";
  import { Workbox } from "workbox-window";

  import Prompt from "./prompt.svelte";

  console.log("prod prompt");

  const wb = new Workbox("/sw.js");
  let showPrompt = false;

  const onAccept = () => {
    wb.addEventListener("controlling", () => {
      window.location.reload();
    });

    // This will postMessage() to the waiting service worker.
    wb.messageSkipWaiting();
  };

  onMount(async () => {
    wb.addEventListener("waiting", () => (showPrompt = true));
    wb.register();
  });
</script>

<Prompt {showPrompt} {onAccept} />
