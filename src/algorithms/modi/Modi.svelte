<script lang="ts">
	import { tick } from "svelte";

	let supply: number[] = [10, 30, 20];
	let demand: number[] = [20, 25, 15];
	let costs: number[][] = [
		[4, 2, 3],
		[2, 5, 1],
		[3, 1, 4],
	];

	function calculateSolution() {
		const result = modiMethod(supply, demand, costs);
		solutionSteps = result.steps;
		solutionTable = result.table;
	}

	function addSupplyRow() {
		supply = [...supply, 0];
		// No need to update 'costs' manually here, the reactive declaration will handle it
	}

	function addDemandColumn() {
		demand = [...demand, 0];
		// No need to update 'costs' manually here, the reactive declaration will handle it
	}

	function deleteSupplyRow(index: number) {
		supply = supply.filter((_, i) => i !== index);
	}

	function deleteDemandColumn(index: number) {
		demand = demand.filter((_, i) => i !== index);
	}

	$: costs = supply.map((_, i) => demand.map((_, j) => costs[i]?.[j] ?? 0));

	let solutionSteps: string[] = [];
	let solutionTable: Cell[][] = [];

	interface Cell {
		supply: number;
		demand: number;
		cost: number;
		allocation: number;
	}

	function modiMethod(
		supply: number[],
		demand: number[],
		costs: number[][],
	): { table: Cell[][]; steps: string[] } {
		const steps: string[] = [];
		// Step 1: Create Initial Feasible Solution (using North-West Corner Rule for simplicity)
		const table: Cell[][] = [];
		let supplyIndex = 0;
		let demandIndex = 0;
		let remainingSupply = [...supply];
		let remainingDemand = [...demand];

		for (let i = 0; i < supply.length; i++) {
			table[i] = [];
			for (let j = 0; j < demand.length; j++) {
				table[i][j] = {
					supply: supply[i],
					demand: demand[j],
					cost: costs[i][j],
					allocation: 0,
				};
			}
		}

		steps.push(
			"**Step 1: Initial Feasible Solution (North-West Corner Rule)**",
		);
		while (supplyIndex < supply.length && demandIndex < demand.length) {
			const allocation = Math.min(
				remainingSupply[supplyIndex],
				remainingDemand[demandIndex],
			);
			table[supplyIndex][demandIndex].allocation = allocation;
			remainingSupply[supplyIndex] -= allocation;
			remainingDemand[demandIndex] -= allocation;

			steps.push(
				`Allocate ${allocation} to cell (${supplyIndex + 1}, ${demandIndex + 1})`,
			);

			if (remainingSupply[supplyIndex] === 0) {
				supplyIndex++;
			} else if (remainingDemand[demandIndex] === 0) {
				demandIndex++;
			}
		}
		steps.push("Initial table:");
		steps.push(getTableAsString(table));

		// Step 2: Calculate u and v values
		let u: number[] = new Array(supply.length).fill(null);
		let v: number[] = new Array(demand.length).fill(null);
		u[0] = 0; // Arbitrarily set u1 = 0

		steps.push("\n**Step 2: Calculate u and v values**");
		steps.push(`Set u[0] = 0`);
		while (u.some((val) => val === null) || v.some((val) => val === null)) {
			for (let i = 0; i < supply.length; i++) {
				for (let j = 0; j < demand.length; j++) {
					if (table[i][j].allocation > 0) {
						if (u[i] !== null && v[j] === null) {
							v[j] = table[i][j].cost - u[i];
							steps.push(
								`Calculate v[${j}] = ${table[i][j].cost} - ${u[i]} = ${v[j]}`,
							);
						} else if (u[i] === null && v[j] !== null) {
							u[i] = table[i][j].cost - v[j];
							steps.push(
								`Calculate u[${i}] = ${table[i][j].cost} - ${v[j]} = ${u[i]}`,
							);
						}
					}
				}
			}
		}

		// Step 3: Calculate opportunity costs
		let opportunityCosts: number[][] = [];
		steps.push("\n**Step 3: Calculate opportunity costs**");
		for (let i = 0; i < supply.length; i++) {
			opportunityCosts[i] = [];
			for (let j = 0; j < demand.length; j++) {
				opportunityCosts[i][j] = table[i][j].cost - u[i] - v[j];
				steps.push(
					`Opportunity cost for cell (${i + 1}, ${j + 1}): ${table[i][j].cost} - ${u[i]} - ${v[j]} = ${opportunityCosts[i][j]}`,
				);
			}
		}

		// Step 4: Check for optimality
		let isOptimal = true;
		steps.push("\n**Step 4: Check for optimality**");
		for (let i = 0; i < supply.length; i++) {
			for (let j = 0; j < demand.length; j++) {
				if (opportunityCosts[i][j] < 0) {
					isOptimal = false;
					steps.push(
						`Opportunity cost for cell (${i + 1}, ${j + 1}) is negative, so the solution is not optimal.`,
					);
					break;
				}
			}
			if (!isOptimal) break;
		}
		if (isOptimal) {
			steps.push(
				"All opportunity costs are non-negative, so the solution is optimal.",
			);
		}

		// ... (Step 5 - Iteration for optimality - Not implemented)

		return { table, steps };
	}

	// Helper function to format the table as a string
	function getTableAsString(table: Cell[][]): string {
		let tableString = "";
		for (let i = 0; i < table.length; i++) {
			for (let j = 0; j < table[i].length; j++) {
				tableString += `(${table[i][j].allocation}, ${table[i][j].cost}) `;
			}
			tableString += "\n";
		}
		return tableString;
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Metodo Modi</h1>

	<div class="flex-col items-start gap-4">
		<div>
			<h2 class="text-lg font-medium mb-2">Input Table</h2>
			<table class="border border-gray-300">
				<thead>
					<tr>
						<th class="px-4 py-2 border-r"></th>
						{#each demand as _, j}
							<th class="px-4 py-2 border-r">Demanda {j + 1}</th>
						{/each}
						<th class="px-4 py-2">Suministro</th>
					</tr>
				</thead>
				<tbody>
					{#each supply as _, i}
						<tr>
							<th class="px-4 py-2 border-r border-b">Suministro {i + 1}</th>
							{#each demand as _, j}
								<td class="px-4 py-2 border-r border-b">
									<input
										type="number"
										class="w-full border border-gray-400 px-2 py-1"
										bind:value={costs[i][j]}
									/>
								</td>
							{/each}
							<td class="px-4 py-2 border-b">
								<input
									type="number"
									class="w-full border border-gray-400 px-2 py-1"
									bind:value={supply[i]}
								/>
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th class="px-4 py-2 border-r">Demanda</th>
						{#each demand as d, j}
							<td class="px-4 py-2 border-r">
								<input
									type="number"
									class="w-full border border-gray-400 px-2 py-1"
									bind:value={demand[j]}
								/>
							</td>
						{/each}
						<td class="px-4 py-2"></td>
					</tr>
				</tfoot>
			</table>
			<div class="mt-4">
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					on:click={addSupplyRow}
				>
					Agregar fila suministro
				</button>
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
					on:click={addDemandColumn}
				>
					Agregar columna demanda
				</button>
			</div>
		</div>

		<div>
			<h2 class="text-lg font-medium mb-2">Solution</h2>
			<button
				class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
				on:click={calculateSolution}
			>
				Calcular
			</button>

			{#if solutionSteps.length > 0}
				<div>
					{#each solutionSteps as step}
						<p>{step}</p>
					{/each}
				</div>

				<h3 class="text-lg font-medium mt-4">Solution Table</h3>
				<table class="border border-gray-300">
					<thead>
						<tr>
							<th class="px-4 py-2 border-r"></th>
							{#each demand as _, j}
								<th class="px-4 py-2 border-r">Demanda {j + 1}</th>
							{/each}
							<th class="px-4 py-2">Suministro</th>
						</tr>
					</thead>
					<tbody>
						{#each solutionTable as row, i}
							<tr>
								<th class="px-4 py-2 border-r border-b">Suministro {i + 1}</th>
								{#each row as cell, j}
									<td class="px-4 py-2 border-r border-b">
										({cell.allocation}, {cell.cost})
									</td>
								{/each}
								<td class="px-4 py-2 border-b">{supply[i]}</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<th class="px-4 py-2 border-r">Demanda</th>
							{#each demand as d, j}
								<td class="px-4 py-2 border-r">{d}</td>
							{/each}
							<td class="px-4 py-2"></td>
						</tr>
					</tfoot>
				</table>
			{/if}
		</div>
	</div>
</div>

<style>
	input.number-to-text::-webkit-outer-spin-button,
	input.number-to-text::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type="number"].number-to-text {
		-moz-appearance: textfield;
	}
	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>
