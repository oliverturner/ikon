// import prettier from "prettier/standalone";
// import parserHTML from "prettier/parser-html";

const ns = "http://www.w3.org/2000/svg";

const node = document.createElement("div");
// const prettierConfig = {
//   parser: "html",
//   plugins: [parserHTML],
// };

export function createSymbol(
	id: string,
	svg: SVGElement | null,
	preserveAttrs: boolean
): string | undefined {
	if (!svg) return;

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
	const symbol = document.createElementNS(ns, "symbol");

	// Set minimum required attrs
	symbol.setAttributeNS(ns, "id", id);
	symbol.setAttributeNS(
		ns,
		"viewBox",
		svg.getAttribute("viewBox") || "0 0 24 24"
	);

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
 */
export function processSVG(preserveAttrs: boolean) {
	return function ({ id, contents }: { id: string; contents: string }) {
		node.innerHTML = contents;
		return createSymbol(id, node.querySelector("svg"), preserveAttrs);
	};
}

export function extractCode(icons: string) {
	// return icons.length > 0
	//   ? prettier.format(`<svg class="spritesheet">${icons}</svg>`, prettierConfig)
	//   : undefined;
	return icons.length > 0
		? `<svg xmlns="http://www.w3.org/2000/svg" class="spritesheet">\n  ${icons}\n</svg>`
		: undefined;
}

export function createResource(code?: string) {
	return code
		? `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`
		: undefined;
}
