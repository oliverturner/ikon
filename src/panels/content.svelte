<style>
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    overflow: hidden;
    background-color: limegreen;
  }
</style>

<div class="content">
  <slot name="gallery" />
  <slot name="selection" />
</div>
