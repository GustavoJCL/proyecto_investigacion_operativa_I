<script>
    let numVariables = 2;
    let numRestricciones = 2;
    let maxMin = 'Max';
    let metodoResolucion = 'Grafico';
    
    let paso = 1;
    const pasoDos = () => {
        paso = 2;
    };
    const solucion = () => {
        paso = 3;
    };

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
                        <!-- Se actualiza dinámicamente -->
                    </div>
                    <h3>Restricciones:</h3>
                    <div class="restricciones">
                        <!-- Se actualiza dinámicamente -->
                    </div>
                    <label for="metodoResolucion">Metodo Resolucion:
                        <select class="cuadrosInput" id="metodoResolucion" bind:value={metodoResolucion}>
                            <option value="Grafico">Grafico</option>
                            <option value="Simplex">Simplex</option>
                            <option value="Simplex Dual">Simplex Dual</option>
                            <option value="Gran M">Gran M</option>
                            <option value="Dos fases">Dos fases</option>
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
        width: 65%;
        margin: auto;
        padding: 20px;
        background-color: #f9f8f8;
        border-radius: 10px;
        box-shadow: 0 0 30px 0 black;
    }

    .seccion-titulo h1 {
        text-align: center;
        color: #2a2a2a;
        margin-bottom: 20px;
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
        border-radius: 2px;
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