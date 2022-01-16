<script lang="ts">
	import type { IconRecord } from "../../typings/types";

	export let iconRecord: IconRecord;
</script>

<button
	class="iconbtn"
	type="button"
	title={iconRecord.name}
	data-key={iconRecord.fullPath}
>
	{@html iconRecord.contents}
</button>
