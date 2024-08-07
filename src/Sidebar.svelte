<script lang="ts">
	import {
		IconAlignJustified,
		IconHome,
		IconLayoutSidebarLeftCollapse,
		IconLogout2,
		IconTable,
	} from "@tabler/icons-svelte";
	import { algorithmOptions } from "./store";
	import { OptionsAlgorithm } from "./utils/state";

	let expanded = false;

	const toggleExpanded = (_: any) => (expanded = !expanded);
</script>

<nav
	class={`h-screen bg-[#324754] text-[#a2b7c4] transition-all duration-200 ease-out overflow-hidden ${expanded ? "w-52" : "w-16"}`}
>
	<button
		class="w-full text-[#a2b7c4] uppercase border-none bg-transparent flex justify-start items-center"
		on:click={toggleExpanded}
	>
		{#if expanded}
			<IconLayoutSidebarLeftCollapse size={36} />
		{:else}
			<IconAlignJustified size={36} />
		{/if}
	</button>

	<div class="h-full flex flex-col">
		<div class="list-none p-5 m-0 flex-col justify-start space-y-3">
			<button
				on:click={() => {
					$algorithmOptions = OptionsAlgorithm.Modi;
				}}
				class="w-52 flex justify-start transition duration-300 ease-in-out hover:scale-105"
			>
				<IconHome />
				<span
					class={`transition-opacity duration-200 ease-out ${expanded ? "opacity-100 visible" : "opacity-0 invisible"}`}
					>Modi</span
				>
			</button>
			<button
				on:click={() => {
					$algorithmOptions = OptionsAlgorithm.Hungarian;
				}}
				class="w-52 flex justify-start transition duration-300 ease-in-out hover:scale-105"
			>
				<IconTable />
				<span
					class={`transition-opacity duration-200 ease-out ${expanded ? "opacity-100 visible" : "opacity-0 invisible"}`}
					>Hungaro</span
				>
			</button>
		</div>
	</div>
</nav>
