<template>
    <div :class="getWrapperClasses">
        <slot name="loading-icon">
            <i v-if="isLoading" class="fas fa-sync fa-spin auto-complete-spinner"></i>
        </slot>
        <input :class="inputClasses"
               type="text"
               :placeholder="placeholder"
               :id="mergeStringWithUUID('multi-select-auto-complete-input')"
               autocomplete="off"
               :value="inputValue"
               @input="updateValue($event.target.value)"
               @keydown.enter='enter'
               @keydown.down='down'
               @keydown.up='up'
               @focus="onFocusIn"
               @blur="onFocusOut">
        <ul class="auto-complete dropdown-menu un-focus" :class="listClasses"
            @blur="onFocusOut"
            :id="mergeStringWithUUID('multi-select-dropdown-menu')"
            tabindex="-1"
            v-if="showSuggestions"
            @keydown.enter='enter'
            @keydown.down='down'
            @keydown.up='up'>
            <li v-for="(aSelection, index) in selectionArray"
                :key="aSelection.id"
                :class="bindClass(index, aSelection, 0)"
                @click="selectedSuggestionClick(index)">
                <slot name="selected" :slot-scope="aSelection">
                    <a>
                        <i class="fas fa-check" style="margin-right: 5px;"></i>
                        <small>{{ aSelection.visibleName }}</small>
                    </a>
                </slot>
            </li>

            <slot name="separator" :slot-scope="showHorizontalLine">
                <hr v-if="showHorizontalLine" class="separator">
            </slot>

            <li v-for="(suggestion, index) in suggestionsFiltered"
                :key="suggestion.id"
                class="auto-complete"
                :class="bindClass(index,suggestion, selectionArray.length)"
                @click="suggestionClick(index)">
                <slot name="suggestion" :slot-scope="suggestion">
                    <a v-if="suggestion[noResultKey]">
                        <small>{{suggestion.visibleName}}</small>
                    </a>
                    <a v-else>
                        <small>{{suggestion.visibleName}}</small>
                    </a>
                </slot>
            </li>
        </ul>
    </div>
</template>

<script>
    import differenceWith from 'lodash.differencewith';

    export default {

        name: "multi-select-auto-complete",
        props: {
            suggestions: {
                type: Array,
                required: true
            },
            selectionArray: {
                type: Array,
                required: true
            },
            isLoading: {
                type: Boolean,
                required: false,
                default: false
            },
            inputClasses: {
                type: Array,
                required: false,
                default: () => ['form-control']
            },
            wrapperClasses: {
                type: Array,
                required: false,
                default: () => ['wrapper']
            },
            listClasses: {
                type: Array,
                required: false,
                default: () => []
            },
            joiner: {
                type: Function,
                default: null
            },
            saveSearchOnFocusOut: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: 'Type to search...'
            },
            noResultKey: {
                type: String,
                default: null
            }
        },
        data() {
            return {
                open: false,
                current: 0,
                inputText: ''
            }
        },
        computed: {
            getWrapperClasses() {
                return [...this.wrapperClasses, this.open ? 'open' : ''];
            },
            showHorizontalLine() {
                return this.suggestionsFiltered.length > 0 && this.selectionArray.length > 0;
            },
            showSuggestions() {
                return this.selectionArray.length > 0 || this.suggestionsFiltered.length > 0;
            },
            getInstance() {
                return this;
            },
            inputValue() {
                return this.open ? this.inputText : this.joiner ? this.joiner(this.selectionArray) : this.selectionArray.map(f => f.visibleName).join(', ');
            },
            suggestionsFiltered() {
                if (this.selectionArray.length > 0) {
                    return differenceWith(this.suggestions, this.selectionArray, (o1, o2) => o1.id === o2.id);
                } else {
                    return this.suggestions;
                }
            }
        },
        methods: {
            onFocusOut(event) {
                if (event && event.relatedTarget && event.relatedTarget.id && [this.mergeStringWithUUID('multi-select-auto-complete-input'), this.mergeStringWithUUID('multi-select-dropdown-menu')].includes(event.relatedTarget.id)) {
                    return;
                }
                this.open = false;
                if (!this.saveSearchOnFocusOut) {
                    this.inputText = '';
                    this.$emit('onSearchParamChanged', '');
                }
                this.$emit("onFocusOut");
                this.current = 0;
            },
            onFocusIn() {
                this.current = 0;
                this.open = true;
                this.$emit("onFocusIn");
            },
            updateValue(value) {
                if (!this.open) {
                    this.open = true;
                    this.current = 0;
                }
                this.inputText = value;
                this.$emit('onSearchParamChanged', value);
            },
            isIndexNoResultSuggestion(index) {
                return this.suggestionsFiltered[index][this.noResultKey];
            },
            isIndexExistsOnSuggestions(index) {
                return this.suggestionsFiltered[index] && this.suggestionsFiltered[index].id;
            },
            enter(event) {
                // understand if we are unselecting or selecting
                if (this.current < this.selectionArray.length) {
                    this.selectedSuggestionClick(this.current);
                } else {
                    let index = this.current - this.selectionArray.length;
                    this.suggestionClick(index);
                }
                event.preventDefault();
            },
            up() {
                this.current > 0 && this.current--;
            },
            down() {
                (this.current < (this.selectionArray.length + this.suggestionsFiltered.length) - 1) && this.current++;
            },
            bindClass(index, suggestion, startFrom) {
                index += startFrom;
                let className = "";
                if (index === this.current && suggestion.id !== -1) {
                    className = "active ";
                }
                else if (suggestion.id === -1) {
                    className = "disabled";
                }
                return className;
            },
            suggestionClick(index) {
                if (this.isIndexExistsOnSuggestions(index)) {
                    if (!this.isIndexNoResultSuggestion(index)) {
                        this.$emit('onSelected', this.suggestionsFiltered[index]);
                    }
                }
            },
            selectedSuggestionClick(index) {
                this.$emit('onSelectedSelectionDelete', index);
            },
            getSuggestionValue(suggestionValue) {
                return (suggestionValue !== "-1" && suggestionValue !== -1) ? suggestionValue : "";
            },
            getTooltip(visibleName) {
                if (visibleName && visibleName.length > 30) {
                    return visibleName;
                } else {
                    return '';
                }
            },
            // TODO replace
            mergeStringWithUUID(normalId) {
                return `${normalId}_${this._uid}`;
            }
        }
    }
</script>

<style scoped>
    .separator {
        margin-bottom: 8px;
        margin-top: 8px;
    }

    .auto-complete-spinner {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .un-focus {
        outline: none;
        box-shadow: none;
        border-color: #ccc;
    }

    ul.auto-complete.dropdown-menu {
        width: 100%;
        max-height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .auto-complete li.disabled {
        pointer-events: none;
        opacity: 0.6;
        cursor: no-drop;
    }

    .wrapper {
        position: relative;
    }
</style>