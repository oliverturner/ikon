<script>
  import Directory from "./directory.sveltecon from "./icon.svelte";

  /** @type IconRecord */
  export let iconRecord = {};
</script>

{#if iconRecord.type === 'directory'}
  <Directory iconDir={iconRecord} />
{/if}

{#if iconRecord.type === 'file'}
  <Icon iconFile={iconRecord} />
{/if}
