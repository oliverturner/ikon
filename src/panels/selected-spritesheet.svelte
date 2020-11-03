<script>
  import { selectedIcons } from "../js/store";
  import Prism from "../components/prism";
  // import Sprite from "../components/sprite.svelte";

  const node = document.createElement("div");

  /**
   * @param {IconRecord} icon
   */
  function processSVG(icon) {
    node.innerHTML = icon.contents;
    const svg = node.querySelector("svg");
    const viewBox = svg.getAttribute("viewBox");
    const id = icon.fullPath.split("/").slice(1).join("-");

    const symbol = document.createElement("symbol");
    symbol.setAttribute("id", id);
    symbol.setAttribute("viewBox", viewBox);

    for (const childNode of svg.childNodes) {
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        symbol.appendChild(childNode.cloneNode(true));
      }
    }

    return symbol.outerHTML;
  }

  $: icons = $selectedIcons.map(processSVG).join("");
  $: code = icons.length > 0 ? `<svg>${icons}</svg>` : "";
</script>

<style>
  .spritesheet {
    max-width: 100%;
    overflow: auto;
  }
</style>

<div class="spritesheet">
  <Prism>{code}</Prism>
</div>
