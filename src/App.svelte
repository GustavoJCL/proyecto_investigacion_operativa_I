<script lang="ts">
	import {
		ResizableHandle,
		ResizablePane,
		ResizablePaneGroup,
	} from "$lib/components/ui/resizable";
	import Modi from "./algorithms/modi/Modi.svelte";
	import "./app.css";
	import Sidebar from "./Sidebar.svelte";
	import HungarianMethod from "./algorithms/hungarian/HungarianMethod.svelte";
  import Lineal from './algorithms/lineal/formulario.svelte';
	import { algorithmOptions } from "./store";
	import { OptionsAlgorithm } from "./utils/state";
</script>

<div class="flex justify-start">
	<Sidebar />
	<div>
		{#if $algorithmOptions == OptionsAlgorithm.Home}
			Proyecto Final - Investigación Operativa I
		{:else if $algorithmOptions == OptionsAlgorithm.Modi}
			<Modi />
		{:else if $algorithmOptions == OptionsAlgorithm.Hungarian}
			<HungarianMethod />
		{:else if $algorithmOptions == OptionsAlgorithm.Lineal}
			
		{/if}
	</div>
</div>