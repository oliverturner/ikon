<script lang="ts">
	import type { IconFile } from "../../typings/types";
	import { selectedIcons } from "../js/store";
	import * as sprite from "../js/sprite";

	let preserveAttrs = true;

	function getIconContents(icon: IconFile) {
		// eslint-disable-next-line
		const svg = getSvg(icon);
		// eslint-disable-next-line
		return svg ? [svg] : [];
	}

	$: getSvg = sprite.processSVG(preserveAttrs);
	$: icons = $selectedIcons.flatMap(getIconContents).join("\n  ");
	$: code = sprite.extractCode(icons);
	$: fileLink = sprite.createResource(code);
</script>

<div class="panel">
	<div class="code-preview">
		{#if code}
			<pre><code>{code}</code></pre>
		{/if}
	</div>
	<div class="controls">
		{#if fileLink}
			<div class="control">
				<input
					id="preserve-attrs"
					type="checkbox"
					bind:checked={preserveAttrs}
				/>
				<label for="preserve-attrs">Preserve attributes</label>
			</div>
			<a class="control" href={fileLink} download="spritesheet.svg">Download</a>
		{:else}
			{@html "&nbsp;"}
		{/if}
	</div>
</div>

<style>
	.panel {
		grid-template-rows: 1fr auto;
	}
	.code-preview {
		overflow: auto;
		max-height: 100%;
		max-width: 100%;
		padding: 0 1rem;
		background: #111;
		color: #ccc;
	}

	.code-preview code {
		overflow: auto;
		font-size: 10px;
	}

	.controls {
		display: flex;
		justify-content: space-between;
	}

	.control {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
