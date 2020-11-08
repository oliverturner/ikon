<script>
  import Directory from "./directory.svelte";
  import Icon from "./icon.svelte";

  /** @type {IconRecord} */
  export let iconRecord = {};

  if (selected) console.log({ selected, fullPath: iconRecord?.fullPath });
</script>

{#if iconRecord.type === 'directory'}
  <Directory {iconRecord} />
{/if}

{#if iconRecord.type === 'file'}
  <Icon {iconRecord} />
{/if}
