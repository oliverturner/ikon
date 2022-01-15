<script>
  /** @type {Ikon.IconFile} */
  export let iconRecord;
</script>

<button class="iconbtn" type="button" title={iconRecord.name} data-key={iconRecord.fullPath}>
  {@html iconRecord.contents}
</button>
