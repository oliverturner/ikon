<script>
  import { selectedIcons } from "../js/store";
  import { createSymbol } from "../js/sprite";

  const node = document.createElement("div");

  /**
   * 1. Construct an SVG element by injecting the icon's `contents` property
   *    into the reusable node <div />
   * 2. Copy the SVG's children and attributes to a new <symbol /> element and
   *    return its text representation
   * @param {IconFile} icon
   */
  function processSVG({ id, contents }) {
    node.innerHTML = contents;
    return createSymbol(id, node.querySelector("svg"));
  }

  function createResource(code) {
    return code
      ? `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`
      : undefined;
  }

  $: icons = $selectedIcons.map(processSVG).join("\n  ");
  $: code =
    icons.length > 0 ? `<svg class="spritesheet">\n  ${icons}\n</svg>` : "";
  $: fileLink = createResource(code);
</script>

<style>
  .container {
    display: grid;
    grid-template-rows: 1fr auto;
    gap: 1rem;

    overflow: hidden;
    max-height: 100%;
    border: 1px solid var(--dir-border);
    border-radius: var(--border-radius);
  }
  .spritesheet {
    overflow: auto;
    max-height: 100%;
    max-width: 100%;
    padding: 1rem;
  }

  .spritesheet pre {
    overflow: auto;
  }

  .controls {
    padding: 1rem;
  }
</style>

<div class="container">
  <div class="spritesheet">
    <pre><code>{code}</code></pre>
  </div>
  <div class="controls">
    {#if fileLink}
      <a href={fileLink} download="spritesheet.svg">Download</a>
    {/if}
  </div>
</div>
