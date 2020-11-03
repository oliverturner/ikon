import { writable, derived } from "svelte/store";

import * as utils from "../js/utils";

function createIconDict() {
  const { subscribe, set, update } = writable(new Map());

  return {
    subscribe,
    set,
    select: (key) =>
      update((map) => {
        const iconRecord = map.get(key);
        iconRecord.selected = !iconRecord.selected;

        // If a directory, apply `selected` value to all children, regardless of depth
        if (iconRecord.type === "directory") {
          // Prefer relevant records to iterating over the entire map
          const childKeys = [...map.keys()].filter((k) => k.startsWith(key));
          for (const childKey of childKeys) {
            map.get(childKey).selected = iconRecord.selected;
          }
        }

        return map;
      }),
    reset: () => set(new Map()),
  };
}

function getSelectedIcons($iconDict) {
  console.log("getSelectedIcons called");

  return [...$iconDict.values()]
    .filter((iconRecord) => iconRecord.type === "file" && iconRecord.selected)
    .sort(utils.sortByRecordKey("fullPath"));
}

export const iconTree = writable([]);
export const iconDict = createIconDict();
export const selectedIcons = derived(iconDict, getSelectedIcons);
