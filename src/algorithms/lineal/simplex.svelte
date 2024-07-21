<script>
    export let maxMin;
    export let objetivo;
    export let restricciones;

    let NV = objetivo.length;
    let NC = restricciones.length; 

    let TS = Array(NC + 2).fill(null).map(() => Array(NV + 2).fill(0));
    let P1, P2, XERR, NOPTIMAL;

    main();

    function main() {
        inicializarTS(objetivo, restricciones, maxMin);
        Simplex();
        mostrarResultados();
    }

    function inicializarTS(objetivo, restricciones, maxMin) {
        let R1 = (maxMin === 'Max') ? 1 : -1;

        // Llenar la función objetivo en TS
        for (let J = 1; J <= NV; J++) {
            TS[1][J + 1] = objetivo[J - 1] * R1;
        }
        TS[1][1] = 0; // Lado derecho de la función objetivo (suponemos 0 para este caso)

        // Llenar las restricciones en TS
        for (let I = 1; I <= NC; I++) {
            for (let J = 1; J <= NV; J++) {
                TS[I + 1][J + 1] = restricciones[I - 1][J - 1] * -1;
            }
            TS[I + 1][1] = restricciones[I - 1][NV]; // Lado derecho de la restricción
        }

        // Añadir variables de holgura (si es necesario)
        for (let I = 1; I <= NC; I++) {
            TS[I + 1][NV + I + 1] = 1;
        }
    }

    function Pivot() {
        let RAP = Infinity;
        let XMAX = 0;

        // Encuentra la columna pivote (la que tiene el máximo valor en la fila 1)
        for (let J = 2; J <= NV + 1; J++) {
            if (TS[1][J] > 0 && TS[1][J] > XMAX) {
                XMAX = TS[1][J];
                P2 = J;
            }
        }

        // Encuentra la fila pivote
        for (let I = 2; I <= NC + 1; I++) {
            if (TS[I][P2] >= 0) continue;
            let V = Math.abs(TS[I][1] / TS[I][P2]);
            if (V < RAP) {
                RAP = V;
                P1 = I;
            }
        }

        // Intercambia las filas
        let temp = TS[0][P2];
        TS[0][P2] = TS[P1][0];
        TS[P1][0] = temp;
    }

    function Formula() {
        // Actualiza la matriz TS utilizando el pivote
        for (let I = 1; I <= NC + 1; I++) {
            if (I === P1) continue;
            for (let J = 1; J <= NV + 1; J++) {
                if (J === P2) continue;
                TS[I][J] -= TS[P1][J] * TS[I][P2] / TS[P1][P2];
            }
        }

        TS[P1][P2] = 1 / TS[P1][P2];
        for (let J = 1; J <= NV + 1; J++) {
            if (J === P2) continue;
            TS[P1][J] *= Math.abs(TS[P1][P2]);
        }

        for (let I = 1; I <= NC + 1; I++) {
            if (I === P1) continue;
            TS[I][P2] *= TS[P1][P2];
        }
    }

    function Optimize() {
        XERR = 0;
        NOPTIMAL = 0;

        // Verifica si hay errores
        for (let I = 2; I <= NC + 1; I++) {
            if (TS[I][1] < 0) XERR = 1;
        }

        // Verifica si el objetivo es óptimo
        for (let J = 2; J <= NV + 1; J++) {
            if (TS[1][J] > 0) NOPTIMAL = 1;
        }
    }

    function Simplex() {
        do {
            console.log("Antes de Pivot:");
            console.log(TS);
            Pivot();
            console.log("Después de Pivot:");
            console.log(TS);
            Formula();
            console.log("Después de Formula:");
            console.log(TS);
            Optimize();
        } while (NOPTIMAL === 1);
    }

    function mostrarResultados() {
    if (XERR === 1) {
        console.log("No hay solución.");
        return;
    }

    console.log("Resultados:");
    for (let J = 2; J <= NV + 1; J++) { // Imprimir solo variables de decisión
        if (TS[0][J] !== undefined) {
            console.log(`VARIABLE #${TS[0][J]}: ${TS[J][1]}`);
        }
    }
    console.log(`Función Económica: ${TS[1][1]}`);
}

</script>

<main>
</main>

<style>
</style>
