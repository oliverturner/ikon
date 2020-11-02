import { writable, derived } from "svelte/store";

import * as utils from "../js/utils";

function createIconDict() {
  const { subscribe, set, update } = writable(new Map());

  return {
    subscribe,
    init: (map) => set(map),
    select: (key) =>
      update((map) => {
        const iconRecord = map.get(key);
        const selected = !iconRecord.selected;

        // Set the `selected` property regardless of record type
        map.set(key, { ...iconRecord, selected });

        // If iconRecord is a directory, apply the parent selected value to all children
        if (iconRecord.type === "directory") {
          // Only update relevant records rather than iterating over the entire map
          const childKeys = [...map.keys()].filter((k) => k.startsWith(key));
          for (const childKey of childKeys) {
            map.set(childKey, { ...map.get(childKey), selected });
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

export const iconDict = createIconDict();
export const selectedIcons = derived(iconDict, getSelectedIcons);
