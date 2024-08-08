<script>
    //Extraido de formulario
    export let maxMin;
    export let objetivo;
    export let restricciones;

    //Tamaño de los arreglos
    let numeroVariables = objetivo.length;
    let numeroRestricciones = restricciones.length;
    //Banderas
    let factible = true;
    //variables para dual

    //Arreglos para identificar columna inicial
    let modificaiones = [];
    let arrayColumnaInicial = [];
    

    //Matriz principal
    let matriz = [];

    for (let i = 0; i <= numeroRestricciones; i++) {
        matriz[i] = [];  
        for (let j = 0; j <= numeroVariables+numeroRestricciones; j++) {
            matriz[i][j] = 0; 
        }
    }

    resolverSimplexDual();
    
    function resolverSimplexDual(){
        organizar();
        //proceso simplexDual FACTIBLE - NO-OPTIMO
        do{
            simplexDual();
        }while(factible == true);
        //proceso simplexPrimal NO-FACTIBLE - OPTIMO
        //simplexPrimal();
        console.log(matriz);
        crearColumnaInicial();
    }

    function organizar (){
        matriz[0][0] = 0;
        for(let i=1; i <= numeroVariables + numeroRestricciones; i++){
            if(i <= numeroVariables){
                if(maxMin == "Max"){
                    matriz[0][i] = -objetivo[i-1];
                }
                else{
                    matriz[0][i] = -objetivo[i-1];
                }
            }
            else{
                matriz[0][i] = 0;
            }
        }   

        
        for (let i=1; i<= numeroRestricciones; i++){
            if (restricciones[i-1][numeroVariables + 1] == ">="){
                matriz[i][0] =  -restricciones[i-1][numeroVariables];
            }
            else{
                matriz[i][0] =  restricciones[i-1][numeroVariables];
            }
            
            for (let j=1; j<= numeroVariables + numeroRestricciones; j++){
                if(j<= numeroVariables){
                    if (restricciones[i-1][numeroVariables + 1] == ">="){
                        matriz[i][j] = -restricciones[i-1][j-1];
                    }
                    else{
                        matriz[i][j] = restricciones[i-1][j-1];
                    }
                }
                else{
                    if (j - numeroVariables == i){
                        matriz[i][j] = 1;
                    }
                    else{
                        matriz[i][j] = 0;
                    }
                }
            }
        }
        
    }
    
    function simplexDual(){
        //Obtener indiceSalida
        let array = [];
        array[0] = Infinity;
        for (let i=1; i<=numeroRestricciones; i++){
            array[i] = matriz[i][0];
        }
        let indiceSalida = indiceValorMasNegativo(array);

        if(array[indiceSalida] >= 0 || indiceSalida == -1){
            factible = false;
            return;
        }

        //Obtener indiceEntrada
        let arrayTemporal = [];
        arrayTemporal[0] = Infinity;
        for (let i=1; i<= numeroVariables + numeroRestricciones; i++){
            if(matriz[indiceSalida][i] >= 0){
                arrayTemporal[i] = Infinity;
            }
            else{
                arrayTemporal[i] = Math.abs(matriz[0][i]/matriz[indiceSalida][i]);
            }
        }
        let indiceEntrada = indiceValorMasNegativo(arrayTemporal);
        console.log(arrayTemporal);

        if(arrayTemporal[indiceEntrada] <= 0 || indiceEntrada == -1){
            factible = false;
            return;
        }

        guardarIndices(indiceSalida, indiceEntrada);

        let interseccion = matriz[indiceSalida][indiceEntrada];
        for (let i=0; i <= numeroVariables + numeroRestricciones; i++){
            matriz[indiceSalida][i] = matriz[indiceSalida][i]/interseccion;
        }

        for (let i=0; i <= numeroRestricciones; i++){
            if(i == indiceSalida){
                continue;
            }
            let pivote = -matriz[i][indiceEntrada];
            for (let j=0; j <= numeroVariables + numeroRestricciones; j++){
                matriz[i][j] = matriz[i][j] + pivote*matriz[indiceSalida][j];
            }
        }
    }

    function indiceValorMasNegativo(array) {
        let indiceMasNegativo = -1; 
        let valorMasNegativo = Infinity; 

        for (let i = 1; i <= array.length; i++) {
            if (array[i] < valorMasNegativo) {
                valorMasNegativo = array[i];
                indiceMasNegativo = i;
            }
        }

        if(valorMasNegativo == 0){
            return -1;
        }

        return indiceMasNegativo;
    }

    function guardarIndices(indiceSalida, indiceEntrada){
        modificaiones.push([indiceSalida, indiceEntrada]);
    }

    

    function inicializarArrayColumnaInicial() {
        arrayColumnaInicial[0] = "Z";
        for (let i = 1; i <= numeroRestricciones; i++) {
            arrayColumnaInicial[i] = "R";
        }
    }

    function crearColumnaInicial() {
        inicializarArrayColumnaInicial();
        for (let i = 1; i <= numeroRestricciones; i++) {
            for (let j = 0; j < modificaiones.length; j++) {
                if (modificaiones[j][0] == i){
                    arrayColumnaInicial[i] = `x${modificaiones[j][1]}`;
                    break;
                }
            }
        }
    }

</script>

<main>
    <fieldset>
        <legend>RESOLUCION</legend>
        <div class="containerSimplex">
            <div class="containerObjetivo">
                <h3>Optimizar</h3>
                <p class="objetivo">{maxMin} Z =</p>
                {#each objetivo as elemento, i}
                <p class="objetivo"> {elemento}x{i+1}</p>
                {/each}
            </div>
            
            <div class="containerCuadro">
            <h3>Cuadro Final</h3>
                <table>
                    <tr>
                        <th>-</th>
                        <th>Sol</th>
                        {#each objetivo as _, i}
                            <th>x{i+1}</th>
                        {/each}
                        {#each restricciones as _, i}
                            <th>s{i+1}</th>
                        {/each}
                    </tr>
                    
                    {#each matriz as array, i}
                        <tr>
                            <td>{arrayColumnaInicial[i]}</td>
                            {#each array as valor}
                                <td>{valor.toFixed(2)}</td>
                            {/each}
                        </tr>
                    {/each}
                </table>
            </div>

            <div class="containerActualizacion">
            <h3>Actualizacion</h3>
                {#each arrayColumnaInicial as elemento, i}
                    {#if elemento == "Z"}
                        <p>Funcion Objetivo = {matriz[0][0]}</p>
                    {:else}
                        {#if elemento != "R"}
                            <p>{elemento} = {matriz[i][0]}</p>
                        {/if}
                    {/if}
                {/each}
            </div>
        </div>
    </fieldset>
</main>

<style>
    * {
        box-sizing: border-box;
        font-family: 'Lucida Sans', sans-serif;
        margin: 0;
        padding: 0;
    }

    fieldset {
        border: 2px solid #afafaf;
        padding: 20px;
        border-radius: 10px;
        margin: 20px;
        background-color: #f9f9f9;
    }

    legend {
        font-size: 1.2em;
        font-weight: bold;
        color: #2a2a2a;
        padding: 0 10px;
    }

    h3 {
        margin-top: 10px;
        margin-bottom: 10px;
        color: #2a2a2a;
        font-size: 1.1em;
        border-bottom: 1px solid #ccc;
        padding-bottom: 5px;
    }

    .containerSimplex {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .containerObjetivo, .containerCuadro, .containerActualizacion {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #fff;
    }

    .objetivo {
        display: inline-block;
        margin: 0;
        padding-right: 10px;
        font-size: 1em;
        color: #333;
    }

    .containerCuadro table {
        width: 100%;
        border-collapse: collapse;
    }

    .containerCuadro th, .containerCuadro td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
        font-size: 0.9em;
    }

    .containerCuadro th {
        background-color: #f2f2f2;
        color: #333;
    }

    .containerCuadro td {
        background-color: #fff;
        color: #555;
    }

    .containerActualizacion p {
        margin: 5px 0;
        font-size: 0.9em;
        color: #333;
    }

</style>
