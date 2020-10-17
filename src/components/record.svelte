<script>
  import Directory from "./directory";
  import Icon from "./icon";

  /** @type IconRecord */
  export let iconRecord = {};
</script>

{#if iconRecord.type === 'directory'}
  <Directory iconDir={iconRecord} />
{/if}

{#if iconRecord.type === 'file'}
  <Icon iconFile={iconRecord} />
{/if}
