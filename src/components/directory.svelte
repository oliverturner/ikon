<script lang="ts">
	import type { IconRecord } from "../../typings/types";
	import * as utils from "../js/utils";
	import Icon from "./icon.svelte";

	function sortContents(contents: IconRecord[]): IconRecord[] {
		contents.sort(utils.sortByRecordKey("name"));
		contents.sort(utils.sortByRecordKey("type"));
		return contents;
	}

	export let iconRecord: IconRecord;

	$: sortedContents = Array.isArray(iconRecord.contents)
		? sortContents(iconRecord.contents)
		: [iconRecord];
</script>

{#if iconRecord.type === "directory"}
	{#if iconRecord.contents?.length > 0}
		<div class="dir">
			<button class="dir__label" data-key={iconRecord.fullPath}>
				{iconRecord.name}:
				{sortedContents.length}
			</button>
			<div class="dir__contents icongrid icongrid--bordered">
				{#each sortedContents as iconRecord (iconRecord.fullPath)}
					<svelte:self {iconRecord} />
				{/each}
			</div>
		</div>
	{/if}
{:else}
	<Icon {iconRecord} />
{/if}

<style>
	.dir {
		grid-column: 1 / -1;
	}

	.dir__contents {
		border-top-left-radius: 0;
	}

	.dir__label {
		position: relative;
		display: inline-block;
		padding: 0.125rem 0.3rem;
		border-top-right-radius: 5px;
		border-top-left-radius: 5px;
		background-color: var(--dir-border);
		color: var(--icongrid-bg);
	}

	.dir__label::before,
	.dir__label::after {
		content: "";
		position: absolute;
		left: 100%;
		bottom: 0;
	}

	.dir__label::before {
		width: 5px;
		height: 5px;
		background-color: var(--dir-border);
	}

	.dir__label::after {
		width: 10px;
		height: 10px;
		border-radius: var(--border-radius);
		background-color: var(--icongrid-bg);
	}
	.dir__label:not(:disabled):hover,
	.dir__label:not(:disabled):focus {
		color: yellow;
	}

	.dir__label:disabled {
		background: #666;
	}
</style>
