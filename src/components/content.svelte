<style>
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      "a b"
      "a c";
    gap: 1rem;

    overflow: hidden;
  }

  :global([slot="gallery"]) {
    grid-area: a;
  }
  :global([slot="selection"]) {
    grid-area: b;
    overflow: hidden;
  }
  :global([slot="spritesheet"]) {
    grid-area: c;
    overflow: hidden;
  }
</style>

<div class="content">
  <slot name="gallery" />
  <slot name="selection" />
  <slot name="spritesheet" />
</div>
