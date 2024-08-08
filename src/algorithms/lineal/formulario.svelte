<script>
    import Simplex from "./simplexPrimal.svelte";
    import Binario from "./binario.svelte";
    import SimplexDual from "./simplexDual.svelte";
    import Grafico from "./grafico.svelte";

    let numVariables = 2;
    let numRestricciones = 2;
    let metodoResolucion = 'Grafico';
    let paso = 1;

    let maxMin = 'Max';
    let objetivo = Array(numVariables).fill(null);
    let restricciones = Array(numRestricciones).fill(null).map(() => Array(numVariables + 2).fill(null));

    function pasoDos() {
        objetivo = Array(numVariables).fill(null);
        restricciones = Array(numRestricciones).fill(null).map(() => Array(numVariables + 2).fill(null));
        paso = 2;
    }

    function solucion() {
        paso = 3;
    }

</script>

<main>
    <div class="container-principal">
        <div class="seccion-titulo">
            <h1>PROGRAMACION LINEAL</h1>
        </div>

        {#if paso === 1}
            <div id="paso1">
                <fieldset>
                    <legend>PASO 1</legend>
                    <h2>Define el numero de variables y restricciones</h2>
                    <label for="numVariables">Variables:
                        <input class="cuadrosInput" type="number" id="numVariables" bind:value={numVariables}>
                    </label>
                    <label for="numRestricciones">Restricciones:
                        <input class="cuadrosInput" type="number" id="numRestricciones" bind:value={numRestricciones}>
                    </label>
                    <label for="maxMin">Objetivo:
                        <select class="cuadrosInput" id="maxMin" bind:value={maxMin}>
                            <option value="Max">Maximización</option>
                            <option value="Min">Minimización</option>
                        </select>
                    </label>
                    <div class="temporal">
                        <button type="button" on:click={pasoDos}>Siguiente</button>
                    </div>
                </fieldset>
            </div>
        {/if}

        {#if paso === 2}
            <div id="paso2">
                <fieldset>
                    <legend>PASO 2</legend>
                    <h2>Define la función objetivo y restricciones</h2>
                    <h3>Función Objetivo:</h3>
                    <div class="funcionObjetivo">
                        {#each Array(numVariables) as _, i}
                            <input 
                                class="inputPasoDos" 
                                type="number" 
                                placeholder={`x${i + 1}`} 
                                bind:value={objetivo[i]}>
                        {/each}
                    </div>
                    <h3>Restricciones:</h3>
                    <div class="restricciones">
                        {#each Array(numRestricciones) as _, i}
                            <div class="restriccion">
                                {#each Array(numVariables) as _, j}
                                    <input 
                                        class="inputPasoDos" 
                                        type="number" 
                                        placeholder={`x${j + 1}`} 
                                        bind:value={restricciones[i][j]}>
                                {/each}
                                <select class="inputPasoDos" bind:value={restricciones[i][numVariables + 1]}>
                                    <option value="<=">&le;</option>
                                    <option value=">=">&ge;</option>
                                    <option value="=">=</option>
                                </select>
                                <input 
                                    class="inputPasoDos" 
                                    type="number" 
                                    placeholder="Valor" 
                                    bind:value={restricciones[i][numVariables]}>
                            </div>
                        {/each}
                    </div>
                    <label for="metodoResolucion">Metodo Resolucion:
                        <select class="cuadrosInput" id="metodoResolucion" bind:value={metodoResolucion}>
                            <option value="Grafico">Grafico</option>
                            <option value="Simplex">Simplex</option>
                            <option value="Simplex Dual">Simplex Dual</option>
                            <option value="Binario">Binario</option>
                        </select>
                    </label>
                    <div class="temporal">
                        <button type="button" on:click={solucion}>Resolver</button>
                    </div>
                </fieldset>
            </div>
        {/if}

        {#if paso === 3}
            <div id="paso3">
                {#if metodoResolucion === 'Grafico'}
                    <Grafico {maxMin} {objetivo} {restricciones}/>
                {/if}

                {#if metodoResolucion === 'Simplex'}
                    <Simplex {maxMin} {objetivo} {restricciones}/>
                {/if}
                
                {#if metodoResolucion === 'Simplex Dual'}
                    <SimplexDual {maxMin} {objetivo} {restricciones}/>
                {/if}
                
                {#if metodoResolucion === 'Binario'}
                    <Binario {maxMin} {objetivo} {restricciones}/>
                {/if}
            </div>        
        {/if}

    </div>
</main>

<style>
    * {
        box-sizing: border-box;
        font-family: 'Lucida Sans';
    }

    .container-principal {
        width: 60%;
        margin: auto;
        padding: 30px 40px;
        background-color: #f8f8f8;
        border-radius: 10px;
        box-shadow: 0 0 30px 0 black;
        border: 3px solid #494949;
    }

    .seccion-titulo h1 {
        text-align: center;
        color: #2a2a2a;
        margin-bottom: 30px;
        font-size: 38px;
    }

    fieldset {
        border: 2px solid #afafaf;
        padding: 20px;
        border-radius: 10px;
    }

    legend {
        font-size: 1.2em;
        font-weight: bold;
        color: #2a2a2a;
        font-weight: 100;
    }

    h2{
        margin-top: 0;
    }
    h3 {
        margin-bottom: 10px;
    }

    h2, h3 {
        color: #2a2a2a;
    }

    label {
        display: block;
        margin-bottom: 10px;
    }

    .cuadrosInput {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #afafaf;
        border-radius: 8px;
        background-color: #eaeaea;
    }

    .inputPasoDos {
        width: 70px;
        margin-right: 8px;
        padding: 8px;
        margin-top: 5px;
        border: 1px solid #afafaf;
        border-radius: 8px;
        background-color: #eaeaea;
    }

    button {
        background-color: #007BFF;
        color: #fff;
        border: none;
        padding: 10px 20px;
        margin-top: 10px;
        border-radius: 8px;
    }

    button:hover {
        background-color: #0056b3;
    }

    .temporal {
        text-align: right;
    }

    .funcionObjetivo, .restricciones {
        margin-bottom: 20px;
    }
</style>