<template>
    <multi-select-auto-complete
            :suggestions="suggestions"
            @onSearchParamChanged="searchParamChanged($event, getInstance)"
            @onSelected="onSelected"
            @onSelectedSelectionDelete="onSelectedEntityDelete"
            :selectionArray="selectedEntities"
            :is-loading="isLoading">
    </multi-select-auto-complete>
</template>

<script>
    import MultiSelectAutoComplete from "./MultiSelectAutoComplete.vue";
    import Vue from 'vue';
    import backend from "./backend";
    import debounce from 'debounce';

    export default {
        components: {
            MultiSelectAutoComplete,
        },
        name: 'star-wars-auto-complete',
        data() {
            return {
                suggestions: [],
                selectedEntities: [],
                isLoading: false
            }
        },
        props: {
            value: {
                type: String,
                required: false
            }
        },
        computed: {
            getInstance() {
                return this;
            }
        },
        created() {
            const c3po = 'C-3PO';
            this.selectedEntities.push({id: c3po, visibleName: c3po});
        },
        methods: {
            onSelected(selection) {
                if (!this.selectedEntities.find(f => f.id === selection.id)) {
                    this.selectedEntities.push(selection);
                }
            },
            searchParamChanged: debounce((searchString, self) => {
                self.inputValue = searchString;
                if (searchString) {
                    self.isLoading = true;
                    return backend.searchCharacters(searchString).then((characters) => {
                        let suggestions = [];
                        if (characters && characters.count > 0) {
                            suggestions = characters.results.map(result => {
                                return {
                                    id: result.name,
                                    visibleName: result.name
                                }
                            });
                        }
                        self.suggestions = suggestions;
                    }).finally(() => self.isLoading = false);
                } else {
                    return self.suggestions = [];
                }
            }, 400),
            onSelectedEntityDelete(index) {
                Vue.delete(this.selectedEntities, index);
            }
        }
    }
</script>

