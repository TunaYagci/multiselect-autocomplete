<template>
    <div :class="getWrapperClasses">
        <slot name="loading-icon">
            <i v-if="isLoading" class="fas fa-sync fa-spin auto-complete-spinner"></i>
        </slot>
        <input :class="inputClasses"
               type="text"
               placeholder="Type to search..."
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

            <li v-for="(suggestion, index) in suggestions"
                :key="suggestion.id"
                class="auto-complete"
                :class="bindClass(index,suggestion, selectionArray.length)"
                @click="suggestionClick(index)">
                <slot name="suggestion" :slot-scope="suggestion">
                    <a>
                        <small>{{ suggestion.visibleName }}</small>
                    </a>
                </slot>
            </li>
        </ul>
    </div>
</template>

<script>

    export default {

        name: "multi-select-auto-complete",
        props: {
            suggestions: {
                type: Array,
                required: true
            },
            inputValue: {
                type: String,
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
            }
        },
        data() {
            return {
                open: false,
                current: 0
            }
        },
        computed: {
            getWrapperClasses() {
                return [...this.wrapperClasses, this.openSuggestion ? 'open' : ''];
            },
            openSuggestion() {
                return (this.input !== '' || this.selectionArray.length !== 0) && this.open === true;
            },
            showHorizontalLine() {
                return this.suggestions.length > 0 && this.selectionArray.length > 0;
            },
            showSuggestions() {
                return this.selectionArray.length > 0 || this.suggestions.length > 0;
            },
            getInstance() {
                return this;
            }
        },
        methods: {
            onFocusOut(event) {
                if (event && event.relatedTarget && event.relatedTarget.id && [this.mergeStringWithUUID('multi-select-auto-complete-input'), this.mergeStringWithUUID('multi-select-dropdown-menu')].includes(event.relatedTarget.id)) {
                    return;
                }
                this.open = false;
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
                this.$emit('onSearchParamChanged', value);
            },
            isIndexNoMatchSuggestion(index) {
                return this.suggestions[index].id === -1;
            },
            isIndexExistsOnSuggestions(index) {
                return this.suggestions[index] && this.suggestions[index].id;
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
                (this.current < (this.selectionArray.length + this.suggestions.length) - 1) && this.current++;
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
                    if (!this.isIndexNoMatchSuggestion(index)) {
                        this.$emit('onSelected', this.suggestions[index]);
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