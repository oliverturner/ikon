<script lang="ts">
	import { draggable } from "../actions/draggable";
	import { iconTree, filteredIconList, searchTerm } from "../js/store";
	import Directory from "../components/directory.svelte";
	import Icon from "../components/icon.svelte";

	export let onDragSelect: (event: CustomEvent<unknown>) => void;

	let preserveDirs = true;

	$: togglableDirs = $searchTerm.length === 0;
</script>

<div class="panel">
	<div class="controls controls--header">
		<div class="control searchbar">
			<label for="searchfield">Search:</label>
			<input
				id="searchfield"
				class="searchfield"
				type="search"
				bind:value={$searchTerm}
			/>
		</div>
	</div>

	{#if preserveDirs && togglableDirs}
		<div class="gallery icongrid" use:draggable on:dragselect={onDragSelect}>
			{#each $iconTree as iconRecord (iconRecord.fullPath)}
				<Directory {iconRecord} />
			{/each}
		</div>
	{:else}
		<div class="gallery icongrid" use:draggable on:dragselect={onDragSelect}>
			{#each $filteredIconList as iconRecord (iconRecord.fullPath)}
				<Icon {iconRecord} />
			{/each}
		</div>
	{/if}

	<div class="controls controls--footer">
		{#if togglableDirs}
			<div class="control">
				<input id="collapse" type="checkbox" bind:checked={preserveDirs} />
				<label for="collapse">Preserve directories</label>
			</div>
		{:else}
			{@html "&nbsp;"}
		{/if}
	</div>
</div>

<style>
	.panel {
		grid-template-rows: auto 1fr auto;
	}
	.gallery {
		height: 100%;
		overflow-y: auto;
		border: none;
	}

	.control {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.searchbar {
		flex: 1;

		display: flex;
	}
	.searchfield {
		flex: 1;
		padding: 0.5rem;
	}
</style>
