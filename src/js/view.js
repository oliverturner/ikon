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
 * @param {IconRecord[]} iconRecords
 * @param {Element} container
 */
export function getHTML(iconRecords, container) {
  // Sort alphabetically by name, then directories first
  iconRecords.sort(utils.sortByRecordKey("name"));
  iconRecords.sort(utils.sortByRecordKey("type"));

  for (const record of iconRecords) {
    let el;

    if (record.type === "directory") {
      // Skip rendering empty directories
      if (record.contents.length === 0) continue;

      const subContainer = document.createElement("ul");
      subContainer.className = "dir__contents icongrid";

      const dirContents = document.createElement("li");
      dirContents.appendChild(subContainer);

      const dirLabel = document.createElement("li");
      dirLabel.innerHTML = `${record.name}: <small>${record.contents.length}</small>`;
      dirLabel.className = "dir__label";

      el = document.createElement("ul");
      el.className = "dir";
      el.appendChild(dirLabel);
      el.appendChild(dirContents);

      getHTML(record.contents, subContainer);
    }

    if (record.type === "file") {
      el = document.createElement("li");
      el.className = "icon";
      el.setAttribute("data-icon-key", record.name);
      el.appendChild(createSVG(record.contents));
    }

    container.appendChild(el);
  }
}
