<script>
    import Lineal from './algorithms/lineal/formulario.svelte';

    let metodo = 'lineal';
    function cambiarLineal(){
        metodo = 'lineal';
    }
    function cambiarTransporte(){
        metodo = 'transporte';
    }

</script>

<main>
    <div class="navbar">
        <button on:click={cambiarLineal}>Programacion Lineal</button>
        <button on:click={cambiarTransporte}>Modelos de transportes</button>
    </div>

    {#if metodo === 'lineal'}
        <Lineal />
    {/if}
    
    <!--
    {#if metodo === 'transporte'}

    {/if}
    -->
</main>

<style>
    .navbar {
        display: flex;
        justify-content: center;
        margin: 40px 0 40px 0;
    }

    button {
        background-color: #007BFF;
        color: #fff;
        border: none;
        padding: 10px 25px;
        margin: 0 5px;
        border-radius: 8px;
        letter-spacing: 1px;
    }

    button:hover {
        background-color: #0056b3;
    }
    
</style>
