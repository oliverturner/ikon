// import prettier from "prettier/standalone";
// import parserHTML from "prettier/parser-html";

const node = document.createElement("div");
// const prettierConfig = {
//   parser: "html",
//   plugins: [parserHTML],
// };

/**
 * @param {string} id
 * @param {SVGElement} svg
 * @param {boolean} preserveAttrs
 */
export function createSymbol(id, svg, preserveAttrs) {
  const attrsToOmit = [
    "xml:space",
    "xmlns",
    "xmlns:xlink",
    "version",
    "id",
    "x",
    "y",
    "width",
    "height",
    "style",
  ];
  const attributes = Object.values(svg.attributes);
  const ns = "http://www.w3.org/2000/svg";
  const symbol = document.createElement("symbol");

  // Set minimum required attrs
  symbol.setAttributeNS(ns, "id", id);
  symbol.setAttributeNS(ns, "viewBox", svg.getAttribute("viewBox"));

  if (preserveAttrs) {
    // Copy across allowed attributes from <svg />
    for (const keyVal of attributes) {
      const { name, value } = keyVal;
      if (attrsToOmit.includes(name) === false) {
        symbol.setAttributeNS(ns, name, value);
      }
    }
  }

  // Clone child elements, excluding text nodes, etc
  for (const childNode of svg.childNodes) {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      symbol.appendChild(childNode.cloneNode(true));
    }
  }

  return symbol.outerHTML;
}

/**
 * 1. Construct an SVG element by injecting the icon's `contents` property
 *    into the reusable <div /> node
 * 2. Copy the SVG's children and attributes to a new <symbol /> element and
 *    return its text representation
 *
 * @param {IconFile} icon
 * @param {boolean} preserveAttrs
 */
export function processSVG(preserveAttrs) {
  return function ({ id, contents }) {
    node.innerHTML = contents;
    return createSymbol(id, node.querySelector("svg"), preserveAttrs);
  };
}

export function extractCode(icons) {
  // return icons.length > 0
  //   ? prettier.format(`<svg class="spritesheet">${icons}</svg>`, prettierConfig)
  //   : undefined;
  return icons.length > 0
    ? `<svg class="spritesheet">\n  ${icons}\n</svg>`
    : undefined;
}

export function createResource(code) {
  return code
    ? `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`
    : undefined;
}
