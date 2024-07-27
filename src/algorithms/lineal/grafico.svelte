<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { writable } from 'svelte/store';

  export let restricciones = [];
  export let objetivo = [];
  export let maxMin;

  let chart;
  let ctx;
  const puntosInterseccion = writable([]);
  let puntoOptimo = { x: 0, y: 0, valor: 0 };

  // Función para calcular el valor del objetivo en cada punto de intersección
  function calcularValorObjetivo(punto, objetivo) {
    return punto.x * objetivo[0] + punto.y * objetivo[1];
  }

  // Función para encontrar el punto óptimo
  function encontrarPuntoOptimo(intersecciones, objetivo, maxMin) {
    let puntoOptimo = intersecciones[0];
    let valorOptimo = calcularValorObjetivo(puntoOptimo, objetivo);

    for (let i = 1; i < intersecciones.length; i++) {
      let valorActual = calcularValorObjetivo(intersecciones[i], objetivo);

      if (maxMin === 'Max' && valorActual > valorOptimo) {
        puntoOptimo = intersecciones[i];
        valorOptimo = valorActual;
      } else if (maxMin === 'Min' && valorActual < valorOptimo) {
        puntoOptimo = intersecciones[i];
        valorOptimo = valorActual;
      }
    }

    return { ...puntoOptimo, valor: valorOptimo };
  }

  onMount(() => {
    ctx = document.getElementById('miGrafico').getContext('2d');
    
    const data = prepararDatosGrafico(restricciones);
    
    const intersecciones = calcularIntersecciones(restricciones);
    puntosInterseccion.set(intersecciones);

    // Encontrar el punto óptimo
    puntoOptimo = encontrarPuntoOptimo(intersecciones, objetivo, maxMin);
    console.log("Punto Óptimo:", puntoOptimo);

    const puntosOrdenados = ordenarPuntos(intersecciones);

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          ...data.lineas,
          ...data.puntos,
          {
          label: 'Área Factible',
          data: puntosOrdenados,
          borderColor: '#000',
          borderWidth: 3,
          fill: true,
          pointRadius: 0,
          showLine: true,
          hidden: true // Inicialmente oculta
        }
        ]
      },
      options: {
        plugins: {
          legend: { display: true }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 0,
            max: data.rango.xMax
          },
          y: {
            type: 'linear',
            min: 0,
            max: data.rango.yMax
          }
        }
      }
    });
  });

  function calcularRango(restricciones) {
    let xMin = Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let yMax = -Infinity;

    for (let i = 0; i < restricciones.length; i++) {
      const [a, b, c] = restricciones[i];

      if (a === 0 && b !== 0 || b === 0 && a !== 0 || a === 0 && b === 0) {
        continue;
      } else {
        const x1 = 0;
        const y1 = c / b;
        const x2 = c / a;
        const y2 = 0;

        xMax = Math.max(xMax, x1, x2);
        yMax = Math.max(yMax, y1, y2);
      }
    }

    const margen = 10;
    return {
      xMax: xMax + margen,
      yMax: yMax + margen
    };
  }

  function prepararDatosGrafico(restricciones) {
    const lineas = [];
    const puntos = [];
    
    const rango = calcularRango(restricciones);
    
    const colores = generarColoresUnicos(restricciones.length);

    restricciones.forEach((restriccion, index) => {
      const [a, b, c] = restriccion;
      const color = colores[index];
      
      let puntosLinea = [];
      
      if (a === 0 && b !== 0) {
        const yConstante = c / b;
        puntosLinea = [
          { x: 0, y: yConstante },
          { x: rango.xMax, y: yConstante }
        ];
      } else if (b === 0 && a !== 0) {
        const xConstante = c / a;
        puntosLinea = [
          { x: xConstante, y: 0 },
          { x: xConstante, y: rango.yMax }
        ];
      } else {
        const x1 = 0;
        const y1 = c / b;
        const x2 = c / a;
        const y2 = 0;

        puntosLinea = [
          { x: x1, y: y1 },
          { x: x2, y: y2 }
        ];
      }
      
      lineas.push({
        label: `Restricción ${index + 1}`,
        data: puntosLinea,
        borderColor: color,
        borderWidth: 2,
        type: 'line'
      });
    });

    return { lineas, puntos, rango };
  }

  function generarColoresUnicos(cantidad) {
    const colores = [];
    for (let i = 0; i < cantidad; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        colores.push(`rgba(${r}, ${g}, ${b}, 1)`);
    }
    return colores;
  }


  function calcularIntersecciones(restricciones) {
    const puntos = [];
    const restriccionesConEjes = [
      ...restricciones,
      [1, 0, 0, '<='],  // x = 0
      [0, 1, 0, '<=']   // y = 0
    ];

    for (let i = 0; i < restriccionesConEjes.length; i++) {
      for (let j = i + 1; j < restriccionesConEjes.length; j++) {
        const interseccion = encontrarInterseccion(restriccionesConEjes[i], restriccionesConEjes[j]);
        if (interseccion && verificarRestricciones(interseccion, restricciones)) {
          puntos.push(interseccion);
        }
      }
    }

    return puntos;
  }
  
  function verificarRestricciones(punto, restricciones) {
    const { x, y } = punto;

    for (let restriccion of restricciones) {
      const [a, b, c, simbolo] = restriccion;
      const valor = a * x + b * y;

      if (simbolo == '<=' && valor > c) return false;
      if (simbolo == '>=' && valor < c) return false;
      if (simbolo == '=' && valor !== c) return false;
    }

    return true;
  }


  function encontrarInterseccion(r1, r2) {
    const [a1, b1, c1] = r1;
    const [a2, b2, c2] = r2;

    const determinante = a1 * b2 - a2 * b1;

    if (determinante === 0) return null;

    const x = (c1 * b2 - c2 * b1) / determinante;
    const y = (a1 * c2 - a2 * c1) / determinante;

    return (x >= 0 && y >= 0) ? { x, y } : null;
  }

  function ordenarPuntos(puntos) {
  if (puntos.length < 3) return puntos;

  // Encontrar el punto más a la izquierda
  let puntoInicial = puntos.reduce((min, p) => (p.x < min.x || (p.x === min.x && p.y < min.y) ? p : min), puntos[0]);
  let puntoActual = puntoInicial;
  let resultado = [puntoInicial];

  while (true) {
    let siguientePunto = puntos[0];
    for (let i = 1; i < puntos.length; i++) {
      if (siguientePunto === puntoActual) {
        siguientePunto = puntos[i];
        continue;
      }
      let orientacion = (siguientePunto.x - puntoActual.x) * (puntos[i].y - puntoActual.y) - (puntos[i].x - puntoActual.x) * (siguientePunto.y - puntoActual.y);
      if (orientacion > 0 || (orientacion === 0 && distancia(puntoActual, puntos[i]) > distancia(puntoActual, siguientePunto))) {
        siguientePunto = puntos[i];
      }
    }
    if (siguientePunto === puntoInicial) break; 
    resultado.push(siguientePunto);
    puntoActual = siguientePunto;
  }

  resultado.push(puntoInicial);

  return resultado;
}

function distancia(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}


</script>

<main>
  <fieldset>
    <legend>RESOLUCIÓN</legend>
    <div class="container">
      <div class="containerObjetivo">
        <h3>Optimizar</h3>
        <p class="objetivo">{maxMin} Z =</p>
        {#each objetivo as elemento, i}
          <p class="objetivo"> {elemento}x{i + 1}</p>
        {/each}
      </div>
      
      <div class="containerGrafico">
        <h3>Gráfico</h3>
        <canvas id="miGrafico" width="100%"></canvas>
      </div>      
      
      <div class="containerNota">
        <div class="notaEtiqueta">
          <p>Nota:</p>
        </div>
        <div class="notaTexto">
          <p>Para visualizar el área factible, asegúrate de desactivar las restricciones individuales y activar el área factible en el gráfico.</p>
        </div>
      </div>
      
      <div class="containerCuadro">
        <h3>Cuadro de Puntos de Intersección</h3>
        <table>
          <thead>
            <tr>
              <th>Punto</th>
              <th>X</th>
              <th>Y</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {#each $puntosInterseccion as punto, index}
              <tr>
                <td>{index + 1}</td>
                <td>{punto.x.toFixed(2)}</td>
                <td>{punto.y.toFixed(2)}</td>
                <td>{(objetivo[0] * punto.x + objetivo[1] * punto.y).toFixed(2)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="containerObjetivo">
        <h3>Actualización</h3>
        <p class="actualizacion">Función Objetivo = {puntoOptimo.valor.toFixed(2)}</p>
        <p class="actualizacion">x = {puntoOptimo.x.toFixed(2)}</p>
        <p class="actualizacion">y = {puntoOptimo.y.toFixed(2)}</p>
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
    border: 2px solid #d1d1d1;
    padding: 20px;
    border-radius: 12px;
    margin: 20px;
    background-color: #fefefe;
  }

  legend {
    font-size: 1.2em;
    font-weight: bold;
    color: #333;
    padding: 0 10px;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .containerObjetivo, .containerGrafico, .containerCuadro, .containerObjetivo{
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .actualizacion{
    color: #333;
  }

  .containerNota {
    background-color: #eaf2f8; /* Color de fondo suave y amigable */
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #bcdff1; /* Color de borde sutil */
    color: #5b5a5a; /* Color del texto */
    display: flex;
    align-items: center; /* Alinea verticalmente el contenido */
  }

  .notaEtiqueta {
    flex: 0 0 auto; /* No se expande ni se contrae */
    margin-right: 15px; /* Espacio entre la etiqueta y el texto */
    font-weight: bold; /* Hacer que la etiqueta sea más destacada */
  }

  .notaTexto {
    flex: 1; /* Ocupa el espacio restante */
    text-align: justify; /* Justifica el texto */
  }

  .objetivo {
    display: inline-block;
    margin: 0;
    padding-right: 10px;
    font-size: 1em;
    color: #333;
  }

  .containerGrafico canvas {
    width: 100%;
    height: auto;
  }

  .containerCuadro table {
    width: 100%;
    border-collapse: collapse;
  }

  .containerCuadro th, .containerCuadro td {
    border: 1px solid #e0e0e0;
    padding: 10px;
    text-align: center;
    font-size: 0.9em;
  }

  .containerCuadro th {
    background-color: #f2f2f2;
    color: #333;
  }

  .containerCuadro td {
    background-color: #ffffff;
    color: #555;
  }

  h3 {
    margin-top: 10px;
    margin-bottom: 10px;
    color: #333;
    font-size: 1.2em;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 5px;
  }

</style>