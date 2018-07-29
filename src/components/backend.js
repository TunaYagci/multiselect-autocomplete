import Vue from 'vue';

export default {
    searchCharacters(name) {
        return Vue.http.get(`https://swapi.co/api/people/?search=${name}&format=json`).then(res => res.body);
    }
}