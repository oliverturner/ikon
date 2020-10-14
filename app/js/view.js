import * as utils from "./utils";

/**
 * @param {string} svgString
 */
export function createSVG(svgString) {
  const fragment = document.createElement("div");
  fragment.innerHTML = svgString;
  return fragment.querySelector("svg");
}

/**
 * Generate the HTML
 *
 * @param {Record<string, IconRecord>} iconRecords
 * @param {Element} container
 */
export function getHTML(iconRecords, container) {
  // Sort directories first
  const sortedKeys = Object.values(iconRecords)
    .sort(utils.compareRecordTypes)
    .map((record) => record.name);

  for (const key of sortedKeys) {
    let el;
    const val = iconRecords[key];

    if (val.type === "directory") {
      // Skip rendering empty directories
      if (Object.keys(val.contents).length === 0) continue;

      const subContainer = document.createElement("ul");
      subContainer.className = "dir__contents icongrid";

      const dirContents = document.createElement("li");
      dirContents.appendChild(subContainer);

      const dirLabel = document.createElement("li");
      dirLabel.textContent = key;
      dirLabel.className = "dir__label";

      el = document.createElement("ul");
      el.className = "dir";
      el.appendChild(dirLabel);
      el.appendChild(dirContents);

      getHTML(val.contents, subContainer);
    }

    if (val.type === "file") {
      el = document.createElement("li");
      el.className = "icon";
      el.setAttribute("data-icon-key", val.name);
      el.appendChild(createSVG(val.contents));
    }

    container.appendChild(el);
  }
}