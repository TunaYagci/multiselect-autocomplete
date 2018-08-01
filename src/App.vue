<template>
    <div id="app">
        <div class="row">
            <div class="col-md-3 center">
                <img class="img-responsive gif col-md-2"
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Vue.js_Logo.svg/400px-Vue.js_Logo.svg.png">
                <h2 class="col-md-10">multiselect-autocomplete</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12 center">
                <img class="img-responsive gif"
                     src="https://media1.tenor.com/images/11f2112c37b0365d51f116af63ccedec/tenor.gif?itemid=9827846"
                     alt="c3po">
                <div class="col-md-3 center">
                    <star-wars-auto-complete/>
                </div>
            </div>
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

    .center {
        margin: 0 auto;
        float: none;
    }

    .gif {
        margin: 0 auto 20px;
        max-width: 20% !important;
    }
</style>
