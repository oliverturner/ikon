/**
 * @param {string} id 
 * @param {SVGElement} svg 
 */
export function createSymbol(id, svg) {
  const attrsToOmit = ["xmlns", "id", "width", "height"];
  const attributes = Object.values(svg.attributes);
  const symbol = document.createElement("symbol");

  // Copy allowed attributes from <svg />
  symbol.setAttribute("id", id);
  for (const keyVal of attributes) {
    const { name, value } = keyVal;
    if (attrsToOmit.includes(name) === false) {
      symbol.setAttribute(name, value);
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
