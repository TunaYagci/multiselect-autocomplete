<template>
    <multi-select-auto-complete
            :inputValue="inputValue"
            :suggestions="suggestions"
            @onSearchParamChanged="searchParamChanged($event, getInstance)"
            @onSelected="onSelected"
            @onSelectedSelectionDelete="onSelectedEntityDelete"
            @onFocusOut="onFocusOut"
            @onFocusIn="onFocusIn"
            :selectionArray="selectedEntities"
            :is-loading="isLoading">
    </multi-select-auto-complete>
</template>

<script>
    import MultiSelectAutoComplete from "./MultiSelectAutoComplete.vue";
    import Vue from 'vue';
    import differenceWith from 'lodash.differencewith';
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
                inputValue: '',
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
            if (this.value && this.value !== '') {
                this.ruleNameByIdList(this.value).then((res) => {
                    if (res && res.length > 0) {
                        this.selectedEntities = res.map((ruleNameDTO) => {
                            if (ruleNameDTO.id && ruleNameDTO.ruleName) {
                                return {
                                    value: ruleNameDTO.id,
                                    visibleName: ruleNameDTO.ruleName
                                }
                            }
                        });
                        this.putSelectionArrayIntoSelectionInput();
                    }
                });
            }
        },
        methods: {
            onSelected(selection) {
                this.addSelection(selection);
            },
            addSelection(selection) {
                if (!this.selectedEntities.find(f => f.value === selection.value)) {
                    this.selectedEntities.push(selection);
                    this.publishEvent();
                    this.suggestions = this.removeDuplicates(this.suggestions);
                }
            },
            removeDuplicates(suggestions) {
                if (this.selectedEntities.length > 0) {
                    return differenceWith(suggestions, this.selectedEntities, (o1, o2) => o1.value === o2.value);
                } else {
                    return suggestions;
                }
            },
            searchParamChanged: debounce((searchString, self) => {
                self.inputValue = searchString;
                if (searchString) {
                    self.isLoading = true;
                    return backend.searchCharacters(searchString).then((characters) => {
                        let suggestions = characters.results.map(result => {
                            return {
                                id: result.name,
                                value: result.name,
                                visibleName: result.name
                            }
                        });
                        self.suggestions = self.removeDuplicates(suggestions);
                    }).finally(() => self.isLoading = false);
                } else {
                    return self.suggestions = [];
                }
            }, 400),
            onSelectedEntityDelete(index) {
                Vue.delete(this.selectedEntities, index);
                this.publishEvent();
            },
            publishEvent() {
                this.$emit('input', this.selectedEntities.map(f => f.value.toString()).join(', '));
            },
            onFocusOut() {
                this.putSelectionArrayIntoSelectionInput();
                this.suggestions = [];
            },
            onFocusIn() {
                this.inputValue = '';
            },
            putSelectionArrayIntoSelectionInput() {
                this.inputValue = this.selectedEntities.map(f => f.visibleName).join(', ');
            }
        }
    }
</script>

