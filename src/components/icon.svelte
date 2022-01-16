<script lang="ts">
	import type { IconFile } from "../../typings/types";

	export let iconRecord: IconFile;
</script>

<button
	class="iconbtn"
	type="button"
	title={iconRecord.name}
	data-key={iconRecord.fullPath}
>
	{@html iconRecord.contents}
</button>
