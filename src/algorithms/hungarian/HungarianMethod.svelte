<script lang="ts">
	let costMatrix: number[][] = [
		[2, 9, 1, 3],
		[6, 4, 5, 7],
		[8, 7, 6, 9],
		[5, 3, 2, 4],
	];

	interface Step {
		description: string;
		matrix: number[][];
	}

	let steps: Step[] = [];
	let result: { assignments: number[][]; totalCost: number } | null = null;

	function hungarianAlgorithm() {
		steps = [];
		result = null;
		const matrix = costMatrix.map((row) => row.slice()); // Create a copy

		// Step 1: Subtract row minimums
		steps.push({
			description: "Restar filas minimas",
			matrix: matrix.map((row) => row.slice()),
		});
		for (let i = 0; i < matrix.length; i++) {
			const min = Math.min(...matrix[i]);
			for (let j = 0; j < matrix[i].length; j++) {
				matrix[i][j] -= min;
			}
		}

		// Step 2: Subtract column minimums
		steps.push({
			description: "Restar columnas minimas",
			matrix: matrix.map((row) => row.slice()),
		});
		for (let j = 0; j < matrix[0].length; j++) {
			const column = matrix.map((row) => row[j]);
			const min = Math.min(...column);
			for (let i = 0; i < matrix.length; i++) {
				matrix[i][j] -= min;
			}
		}

		// Step 3-5: Cover zeros with minimum lines and adjust matrix (simplified)
		steps.push({
			description: "Cubrir ceros y ajustar la matriz",
			matrix: matrix.map((row) => row.slice()),
		});
		while (true) {
			let zerosCovered = 0;
			for (let i = 0; i < matrix.length; i++) {
				for (let j = 0; j < matrix[i].length; j++) {
					if (matrix[i][j] === 0) {
						zerosCovered++;
					}
				}
			}
			if (zerosCovered >= matrix.length) {
				break;
			}
			// Adjust matrix (simplified) - find the smallest uncovered element and subtract it from all uncovered elements
			let minUncovered = Infinity;
			for (let i = 0; i < matrix.length; i++) {
				for (let j = 0; j < matrix[i].length; j++) {
					if (matrix[i][j] !== 0) {
						minUncovered = Math.min(minUncovered, matrix[i][j]);
					}
				}
			}
			for (let i = 0; i < matrix.length; i++) {
				for (let j = 0; j < matrix[i].length; j++) {
					if (matrix[i][j] !== 0) {
						matrix[i][j] -= minUncovered;
					}
				}
			}
		}

		// Step 6: Assign tasks (simplified)
		steps.push({
			description: "Asignar tareas",
			matrix: matrix.map((row) => row.slice()),
		});
		const assignments: number[][] = [];
		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				if (matrix[i][j] === 0) {
					assignments.push([i, j]);
				}
			}
		}

		// Calculate total cost
		let totalCost = 0;
		for (const [i, j] of assignments) {
			totalCost += costMatrix[i][j];
		}

		result = { assignments, totalCost };
	}

	function addRow() {
		const newRow = new Array(costMatrix[0].length).fill(0);
		costMatrix = [...costMatrix, newRow];
	}

	function addColumn() {
		costMatrix = costMatrix.map((row) => [...row, 0]);
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Metodo Hungaro</h1>

	<div class="mb-4 flex justify-end">
		<button
			on:click={addRow}
			class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
		>
			Agregar Columna
		</button>
		<button
			on:click={addColumn}
			class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
		>
			Agregar Fila
		</button>
	</div>

	<table class="table-auto border-collapse border border-gray-400">
		<thead>
			<tr>
				<th class="border border-gray-400 px-2 py-1" />
				{#each costMatrix[0] as _, j}
					<th class="border border-gray-400 px-2 py-1">Columna {j + 1}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each costMatrix as row, i}
				<tr>
					<td class="border border-gray-400 px-2 py-1">Fila {i + 1}</td>
					{#each row as cell, j}
						<td class="border border-gray-400 px-2 py-1">
							<input
								type="number"
								bind:value={costMatrix[i][j]}
								class="appearance-none w-full px-2 py-1 rounded"
							/>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<button
		on:click={hungarianAlgorithm}
		class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
	>
		Calcular
	</button>

	{#if steps.length > 0}
		<div class="mt-4">
			<h2 class="text-lg font-bold mb-2">Pasos:</h2>
			<ul>
				{#each steps as step}
					<li class="mb-2">
						<div class="font-bold">{step.description}</div>
						<table class="table-auto border-collapse border border-gray-400">
							<tbody>
								{#each step.matrix as row}
									<tr>
										{#each row as cell}
											<td class="border border-gray-400 px-2 py-1">{cell}</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if result}
		<div class="mt-4">
			<h2 class="text-lg font-bold mb-2">Result:</h2>

			<table class="table-auto border-collapse border border-gray-400">
				<thead>
					<tr>
						<th class="border border-gray-400 px-2 py-1"> </th>
						{#each costMatrix[0] as _, j}
							<th class="border border-gray-400 px-2 py-1">Columna {j + 1}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each costMatrix as _, i}
						<tr>
							<td class="border border-gray-400 px-2 py-1">Fila {i + 1}</td>
							{#each costMatrix[0] as _, j}
								<td class="border border-gray-400 px-2 py-1">
									{#if result.assignments.some((assignment) => assignment[0] === i && assignment[1] === j)}
										<div class="font-bold text-green-500">Asignado</div>
									{:else}
										-
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>

			<div>Total Cost: {result.totalCost}</div>
		</div>
	{/if}
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
