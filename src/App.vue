<template>
    <div id="app">
        <div class="col-md-3">
            <star-wars-auto-complete/>
        </div>
    </div>
</template>

<script>
    import StarWarsAutoComplete from "./components/StarWarsAutoComplete.vue";

    export default {
        name: 'app',
        components: {
            StarWarsAutoComplete
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
