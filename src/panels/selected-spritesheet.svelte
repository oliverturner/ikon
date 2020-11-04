<script>
  import prettier from "prettier/standalone";
  import parserHTML from "prettier/parser-html";

  import { selectedIcons } from "../js/store";
  import { createSymbol } from "../js/sprite";

  const node = document.createElement("div");
  const prettierConfig = {
    parser: "html",
    plugins: [parserHTML],
  };

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

  function extractCode(icons) {
    return icons.length > 0
      ? prettier.format(
          `<svg class="spritesheet">${icons}</svg>`,
          prettierConfig
        )
      : undefined;
  }

  function createResource(code) {
    return code
      ? `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`
      : undefined;
  }

  $: icons = $selectedIcons.map(processSVG).join("\n  ");
  $: code = extractCode(icons);
  $: fileLink = createResource(code);
</script>

<style>
  .container {
    display: grid;
    grid-template-rows: 1fr auto;

    overflow: hidden;
    max-height: 100%;
    border: 1px solid var(--dir-border);
    border-radius: var(--border-radius);
  }
  .code-preview {
    overflow: auto;
    max-height: 100%;
    max-width: 100%;
    padding: 0 1rem;
    background: #111;
    color: #ccc;
  }

  .code-preview code {
    overflow: auto;
    font-size: 10px;
  }

  .controls {
    padding: 1rem;
  }

  .embed-svg {
    display: none;
  }
</style>

<div class="container">
  <div class="code-preview">
    {#if code}
      <pre><code>{code}</code></pre>
    {/if}
  </div>
  <div class="controls">
    {#if fileLink}
      <a href={fileLink} download="spritesheet.svg">Download</a>
    {/if}
  </div>
</div>

<div class="embed-svg">
  {@html code}
</div>
