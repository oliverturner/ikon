<script>
  import { fade, fly } from "svelte/transition";

  export let showPrompt = false;

  export let onAccept = () => {
    console.log("onAccept called: update SW");
  };

  export let onReject = () => {
    showPrompt = false;
  };
</script>

<style lang="scss">
  .prompt {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    position: absolute;
    bottom: 1rem;
    right: 1rem;
    padding: 1rem;
    box-shadow: 0 10px 6px -6px #777;
    background: #fff;

    & p {
      margin: 0;
    }

    .btn {
      --border-colour: transparent;

      padding: 5px;
      border: 1px solid var(--border-colour);
      border-radius: 3px;

      &.btn--accept {
        --border-colour: #333;
      }

      &.btn--reject {
        --border-colour: #ccc;

        background: #ccc;
      }
    }
  }
</style>

{#if showPrompt}
  <div class="prompt" in:fly={{ y: 200 }} out:fade={{ duration: 250 }}>
    <p>An update is available:</p>
    <button
      class="btn btn--accept"
      type="button"
      on:click={onAccept}>Update</button>
    <button
      class="btn btn--reject"
      type="button"
      on:click={onReject}>Dismiss</button>
  </div>
{/if}
