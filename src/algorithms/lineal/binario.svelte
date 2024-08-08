<script>
    export let maxMin;
    export let objetivo;
    export let restricciones;

    let numVariables = objetivo.length;
    let numRestricciones = restricciones.length;

    let visto = '\u2713';
    let equis = '\u2717';

    let MatrizPrincipal = [];
    let MatrizResult = [];
    let Matrizcheck = [];
    let MatrizBinaria = [];
    let arrayColumnaInicial = [];
    let numCombinaciones = 2 ** numVariables;

    Binaria();

    function Binaria(){
        CrearMatrizBinaria();
        verificacionBinaria();
        CrearMatrizPrincipal()
    }


    function CrearMatrizBinaria() {
        for (let i = 0; i < numCombinaciones; i++) {
            MatrizBinaria[i] = [];  
            for (let j = 0; j < numVariables; j++) {
                MatrizBinaria[i][j] = 0; 
            }
            
            let binario = i.toString(2); 
            let longitudBinario = binario.length;
            
            for (let k = 0; k < longitudBinario; k++) {
                MatrizBinaria[i][numVariables - longitudBinario + k] = parseInt(binario[k]);
            }
        }       
        return MatrizBinaria;
    }


    function verificacionBinaria() {
        let evalue_restricciones;
        let evalue;

        for (let i = 0; i < numCombinaciones; i++) {
            Matrizcheck[i] = [];  
            for (let j = 0; j < numVariables; j++) {
                Matrizcheck[i][j] = equis; 
            }
        }
        for (let i = 0; i < numRestricciones; i++) {
            let valor = restricciones[i][numVariables];
            let signo = restricciones[i][numVariables + 1];
            let aux = 0;
            for (let j = 0; j < numCombinaciones; j++) { 
                evalue_restricciones = 0;
                evalue = 0;
                for (let k = 0; k < numVariables; k++) {
                    evalue_restricciones += restricciones[i][k] * MatrizBinaria[j][k];
                    evalue += objetivo[k] * MatrizBinaria[j][k];
                    if (k === numVariables - 1) {
                        if (signo === '<=') {
                            if (evalue_restricciones <= valor)
                                Matrizcheck[aux][i] = visto;
                        } else if (signo === '>=') {
                            if (evalue_restricciones >= valor)
                                Matrizcheck[aux][i] = visto;
                        } else if (signo === '=') {
                            if (evalue_restricciones === valor) 
                                Matrizcheck[aux][i] = visto;
                        }
                        Matrizcheck[aux][numRestricciones] = evalue;
                        aux++;
                    }
                }
            }
        }
        return Matrizcheck;
    }


    function ValoresCumplidos() {
        for (let i = 0; i < numCombinaciones; i++) {
            let todasVistas = true;

            for (let j = 0; j < numVariables; j++) {
                if (Matrizcheck[i][j] !== visto) {
                    todasVistas = false;
                    break;
                }
            }
            if (todasVistas === true) {
                MatrizResult.push(Matrizcheck[i][numVariables]);
            }
        }
        return MatrizResult;
    }


    function inicializarArrayColumnaInicial() {
        for (let i = 0; i < numCombinaciones; i++) {
            arrayColumnaInicial[i] = i + 1;
        }
        return arrayColumnaInicial;
    }


    function CrearMatrizPrincipal(){
        inicializarArrayColumnaInicial()
        for(let i = 0; i < numCombinaciones; i++){
            MatrizPrincipal[i] = [];
            for(let j = 1; j <= numVariables; j++){
                MatrizPrincipal[i][0] = arrayColumnaInicial[i];
                MatrizPrincipal[i][j] = MatrizBinaria[i][j-1];
            }
        }
        for(let i = 0; i < numCombinaciones; i++){
            for(let j = numVariables+1; j <= numVariables + numRestricciones + 1; j++){
                MatrizPrincipal[i][j] = Matrizcheck[i][j-numVariables-1];
            }
        }
        return MatrizPrincipal;
    }


    function ResultVerif(){
        ValoresCumplidos();
        let mayor = -Infinity;
        let menor = Infinity;
        if(maxMin === 'Max'){
            MatrizResult.forEach(element => {
                if(mayor < element){
                    mayor = element;
                }
            });
            return mayor;    
        }else{
            MatrizResult.forEach(element => {
                if(menor > element){
                    menor = element;
                }
            });
            return menor;   
        }
    }

    let Respuesta = ResultVerif();

</script>

<main>
    <fieldset>
        <legend>RESOLUCION</legend>
            <div class="containerBinario">
                <div class="containerObjetivo">
                    <h3>Optimizar</h3>
                    <p class="objetivo">{maxMin} Z = </p>
                    {#each objetivo as elemento, i}
                        <p class="objetivo"> {elemento}x{i+1}</p>
                    {/each}
                </div>
                <div class="containerCuadro">
                    <h3>Tabla Binaria</h3>
                    <table>
                        <tr>
                            <th>-</th>
                            {#each objetivo as _, i}
                                <th>x{i+1}</th>
                            {/each}
                            {#each restricciones as _, i}
                                <th>R{i+1}</th>
                            {/each}
                            <th>Z</th>
                        </tr>
                        {#each MatrizPrincipal as array,i}
                            <tr>
                                {#each array as valor}
                                    <td>{valor}</td>
                                {/each}
                            </tr>
                        {/each}

                    </table>
                </div>
                <div class="containerActualizacion">
                    <h3>Actualizacion</h3>
                    <p>Funcion Objetivo = {Respuesta}</p>
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

    .containerBinario {
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