import { writable } from "svelte/store";

/** @type {IconRecord[]} */
export const iconRecords = writable([]);

/** @type {Record<string, IconRecord>} */
export const fileDict = writable(new Map());
