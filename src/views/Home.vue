<template>
    <div id="app">
        <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <div class="row">
            <div class="col-md-12 center">
                <img class="img-responsive gif-smaller"
                     src="https://vuejs.org/images/logo.png">
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
    import StarWarsAutoComplete from "../components/StarWarsAutoComplete";
    import 'bootstrap/dist/css/bootstrap.min.css'

    export default {
        name: 'home',
        components: {
            StarWarsAutoComplete
        }
    }
</script>

<style scoped>

    .center {
        margin: 0 auto;
        float: none;
    }

    .gif {
        margin: 0 auto 30px;
        max-width: 20% !important;
    }

    .gif-smaller {
        margin: 0 auto 20px;
        max-width: 5% !important;
    }
</style>
