<script lang="ts">
import { defineComponent, ref, watchEffect, computed, nextTick } from 'vue'

export interface AtomSelectOption {
  value: string | number
  label: string
  children?: AtomSelectOption[]
}

export interface AtomSelectProps {
  options: AtomSelectOption[]
}

export default defineComponent({
  name: 'AtomSelect',
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: false
    },
    options: {
      type: Array as () => AtomSelectProps['options'],
      required: true
    },
    label: {
      type: String,
      required: false,
      default: null
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    emptyLabel: {
      type: String,
      required: false,
      default: 'Select option'
    },
    isValid: {
      type: Boolean,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    withSearch: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup(props, { emit }) {
    const isOpen = ref(false)
    const selectedOptions = ref<AtomSelectOption[]>([])
    const searchTerm = ref('')
    const focusedIndex = ref(-1)
    const searchInputRef = ref<HTMLInputElement>()

    const filteredOptions = computed<AtomSelectOption[]>(() => {
      return props.options.filter((option) => {
        const groupMatch = option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
        let anyChildMatch = false

        if (option.children && option.children.length > 0 && 'filter' in option.children) {
          option.children = option.children.filter((childOption) =>
            childOption.label.toLowerCase().includes(searchTerm.value.toLowerCase())
          )

          if (option.children.length > 0) {
            anyChildMatch = true
          }
        }

        return groupMatch || anyChildMatch
      })
    })

    const selectedOptionsRender = computed(() =>
      selectedOptions.value.map((option) => option.label).join(', ')
    )

    const getOptionId = (index: number) => {
      return `${props.id || props.name}-option-${index}`
    }

    const getActiveDescendantId = computed(() => {
      return focusedIndex.value >= 0 ? getOptionId(focusedIndex.value) : undefined
    })

    const openDropdown = () => {
      isOpen.value = true
    }

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    const closeDropdown = () => {
      isOpen.value = false
      focusedIndex.value = -1
    }

    const selectOption = (option: AtomSelectOption) => {
      const find = selectedOptions.value.find(
        (selectedOption) => selectedOption.value === option.value
      )
      console.log(find)
      if (!find) {
        if (props.multiple) {
          selectedOptions.value.push(option)
        } else {
          selectedOptions.value = [option]
        }
      } else {
        if (props.multiple) {
          selectedOptions.value = selectedOptions.value.filter(
            (selectedOption) => selectedOption.value !== option.value
          )
        } else {
          selectedOptions.value = []
        }
      }

      emit('update:modelValue', selectedOptions.value)
      emit(
        'update:isValid',
        (props.required && selectedOptions.value.length > 0) || !props.required
      )

      if (!props.multiple) {
        closeDropdown()
      }
    }

    const focusOption = (index: number) => {
      focusedIndex.value = index
    }

    const focusNextOption = () => {
      focusedIndex.value =
        focusedIndex.value < filteredOptions.value.length - 1 ? focusedIndex.value + 1 : 0
    }

    const focusPreviousOption = () => {
      focusedIndex.value =
        focusedIndex.value > 0 ? focusedIndex.value - 1 : filteredOptions.value.length - 1
    }

    const toggleSelect = () => {
      if (focusedIndex.value >= 0) {
        selectOption(filteredOptions.value[focusedIndex.value])
      }
    }

    const handleOutsideClick = (event: Event) => {
      if (!(event.target as HTMLElement).closest('.dropdown-container')) {
        closeDropdown()
      }
    }

    watchEffect(() => {
      if (isOpen.value) {
        document.addEventListener('click', handleOutsideClick)
        nextTick(() => {
          if (searchInputRef.value && 'focus' in searchInputRef.value) {
            searchInputRef.value.focus()
          }
        })
      } else {
        document.removeEventListener('click', handleOutsideClick)
      }
    })

    return {
      isOpen,
      selectedOptions,
      selectedOptionsRender,
      searchTerm,
      focusedIndex,
      filteredOptions,
      getOptionId,
      getActiveDescendantId,
      toggleDropdown,
      closeDropdown,
      selectOption,
      focusOption,
      focusNextOption,
      focusPreviousOption,
      toggleSelect,
      openDropdown,
      searchInputRef
    }
  }
})
</script>

<template>
  <div class="dropdown" data-testid="atom-select-container">
    <label
      @click="toggleDropdown"
      @keyup.enter="toggleDropdown"
      @keyup.space="toggleDropdown"
      @focus="toggleDropdown"
      tabindex="0"
      data-testid="input-label"
    >
      {{ label }}
      <input :name="name" type="hidden" :required="required" />
    </label>

    <div :class="{ 'dropdown-container p-relative': true, open: isOpen }">
      <div
        class="dropdown-field text-gunmetal-60 ly-row ly-spacebetween-center non-interactive"
        data-testid="atom-select"
        @click="toggleDropdown"
      >
        <p
          v-if="selectedOptions.length"
          data-testid="atom-select-selected-option"
          :title="selectedOptionsRender"
        >
          {{ selectedOptionsRender }}
        </p>
        <p v-if="!selectedOptions.length" data-testid="atom-select-selected-option">
          {{ emptyLabel }}
        </p>
        <i :class="{ 'lpi-caret-up': isOpen, 'lpi-caret-down': !isOpen }"></i>
      </div>

      <ul
        id="dropdown-options"
        role="listbox"
        data-testid="atom-select-options-list"
        class="dropdown-options menu-pop-up"
        :class="{ visible: isOpen, 'has-search': withSearch }"
        :aria-label="label"
        :aria-hidden="!isOpen"
      >
        <li v-if="withSearch" class="dropdown-search">
          <input
            :id="id || name"
            class="dropdown-input mb-half"
            type="text"
            placeholder="Type to search..."
            v-model="searchTerm"
            @click.stop
            @keydown.prevent.down="focusNextOption"
            @keydown.prevent.up="focusPreviousOption"
            @keydown.enter="toggleSelect"
            @keydown.space="toggleSelect"
            @keydown.esc="closeDropdown"
            aria-autocomplete="list"
            aria-expanded="false"
            aria-controls="dropdown-options"
            :aria-activedescendant="getActiveDescendantId"
            ref="searchInputRef"
            data-testid="atom-select-search-input"
          />
        </li>
        <li
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          class="dropdown-option"
          :class="{
            selected: selectedOptions.length > 0 && selectedOptions.includes(option),
            ['is-group']: option.children && option.children.length > 0
          }"
          :id="getOptionId(index)"
          role="option"
          @click="option.children && option.children.length > 0 ? false : selectOption(option)"
          @mouseenter="focusOption(index)"
          @keydown.enter="
            option.children && option.children.length > 0 ? false : selectOption(option)
          "
          :tabindex="option.children && option.children.length > 0 ? -1 : 0"
          data-testid="atom-select-option"
        >
          <a href="#" tabindex="-1">{{ option.label }}</a>
          <span v-if="option.children && option.children?.length > 0">
            <span
              v-for="(optionChild, indexChild) in option.children"
              :key="optionChild.value"
              class="dropdown-option ml-2"
              :class="{
                selected: selectedOptions && selectedOptions.includes(optionChild)
              }"
              :id="getOptionId(indexChild)"
              role="option"
              @click="selectOption(optionChild)"
              @mouseenter="focusOption(indexChild)"
              @keydown.enter="selectOption(optionChild)"
              tabindex="0"
              data-testid="atom-select-option"
            >
              <a href="#" tabindex="-1">{{ optionChild.label }}</a>
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dropdown-field {
  box-sizing: border-box;
  border-radius: 4px;
  height: 32px;
  background: #dfe4ec;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  border: none;
  width: 100%;
  line-height: 33px;
}

.dropdown-field p {
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 30vw;
}

.dropdown-container:is(.open) .dropdown-options {
  top: 35px;
}

.dropdown-options {
  max-height: 300px;
  overflow: auto;
}

.dropdown-options.has-search {
  padding-top: 0;
}

.dropdown-options.has-search li.dropdown-search {
  position: sticky;
  top: 0;
  z-index: 1;
  padding-top: 1rem;
  background-color: #fff;
}

.dropdown-options.has-search li.dropdown-search input {
  width: 95%;
}

.dropdown-options li.is-group > a {
  color: var(--color-dark);
  cursor: default;
}
.dropdown-options li.is-group > span {
  color: var(--color-dark);
  cursor: default;
  padding: 0;
}
.dropdown-options li.is-group .dropdown-option {
  padding: 0.5rem 1rem;
  flex: 1;
}
.dropdown-options li.is-group > a:hover {
  color: inherit;
}

.dropdown-options li:hover:not(:first-child):not(.is-group) {
  background-color: var(--color-blue-hover);
}

.dropdown-option {
  padding: 0.1rem 0;
}

.dropdown-option.selected {
  background-color: var(--color-blue-hover);
}
.dropdown-option.selected a {
  color: var(--color-orange);
}

@media screen and (max-width: 580px) {
  .dropdown-field p {
    max-width: 80vw;
  }
}
</style>
