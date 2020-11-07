<script>
  export let iconRecord;
</script>

<button class="iconbtn" type="button" data-key={iconRecord.fullPath}>
  {@html iconRecord.contents}
</button>
