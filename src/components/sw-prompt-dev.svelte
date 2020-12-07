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
  });
</script>

<Prompt {showPrompt} {onAccept} />
