<script>
  import { onMount } from "svelte";

  import Prompt from "./prompt.svelte";

  console.log("dev prompt");

  let showPrompt = false;

  function onAccept() {
    window.location.reload();
  }

  onMount(async () => {
    showPrompt = true;
    console.log("show prompt!", showPrompt);
  });
</script>

<Prompt {showPrompt} {onAccept} />
