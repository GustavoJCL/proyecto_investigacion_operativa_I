<script lang="ts">
	import Modi from "./algorithms/modi/Modi.svelte";
	import "./app.css";
	import Sidebar from "./Sidebar.svelte";
	import HungarianMethod from "./algorithms/hungarian/HungarianMethod.svelte";
	import Lineal from "./algorithms/lineal/formulario.svelte";
	import { algorithmOptions } from "./store";
	import { OptionsAlgorithm } from "./utils/state";
	import Principal from "./Principal.svelte";
</script>

<div class="flex justify-start w-full">
	<Sidebar />
	<div>
		{#if $algorithmOptions == OptionsAlgorithm.Home}
			<Principal />
		{:else if $algorithmOptions == OptionsAlgorithm.Modi}
			<Modi />
		{:else if $algorithmOptions == OptionsAlgorithm.Hungarian}
			<HungarianMethod />
		{:else if $algorithmOptions == OptionsAlgorithm.Lineal}
			<Lineal />
		{/if}
	</div>
</div>

