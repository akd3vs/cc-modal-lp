<script lang="ts">
import { defineComponent, ref, watchEffect, computed, nextTick } from 'vue'

export interface AtomSelectOption {
  value: string | number
  label: string
  children?: AtomSelectOption[]
  filteredChildren?: AtomSelectOption[]
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
    const searchTerm = ref<String>('')
    const focusedIndex = ref(-1)
    const searchInputRef = ref<HTMLInputElement>()
    const dropdownContainerRef = ref<HTMLDivElement>()
    const instanceId = ref(crypto.randomUUID())
    const optionsRef = ref(props.options)

    const filteredOptions = computed<AtomSelectOption[]>(() => {
      return optionsRef.value.filter((option) => {
        const groupMatch = option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
        let anyChildMatch = false
        const hasChildren = option.children && option.children.length > 0

        if (hasChildren && Array.isArray(option.children)) {
          option.filteredChildren = option.children.filter((childOption) =>
            childOption.label.toLowerCase().includes(searchTerm.value.toLowerCase())
          )

          if (option.filteredChildren.length > 0) {
            anyChildMatch = true
          }
        }

        if (groupMatch && hasChildren && !anyChildMatch) {
          return false
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

      if (isOpen.value) {
        nextTick(() => {
          if (searchInputRef.value && 'focus' in searchInputRef.value) {
            searchInputRef.value.focus()
          }
        })
      }
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
      const closest = (event.target as HTMLElement).closest('.dropdown-container')
      const parentId =
        closest && closest.parentNode && (closest.parentNode as HTMLElement).getAttribute('id')
      if (!closest || (closest && parentId !== instanceId.value)) {
        closeDropdown()
      }
    }

    watchEffect(() => {
      if (isOpen.value) {
        document.addEventListener('click', handleOutsideClick)
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
      searchInputRef,
      dropdownContainerRef,
      instanceId
    }
  }
})
</script>

<template>
  <div class="select" :id="instanceId" data-testid="atom-select-container">
    <label
      @click="toggleDropdown"
      @keyup.enter="toggleDropdown"
      @keyup.space="toggleDropdown"
      @focus="toggleDropdown"
      tabindex="0"
      data-testid="input-label"
      :data-input-name="name"
    >
      {{ label }}
      <input :name="name" type="hidden" :required="required" />
    </label>

    <div class="dropdown-container p-relative" :class="{ open: isOpen }" ref="dropdownContainerRef">
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

      <div class="dropdown" :class="{ visible: isOpen, 'has-search': withSearch }">
        <div v-if="withSearch" class="dropdown-search">
          <i class="lpi-search"></i>
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
        </div>
        <ul
          id="dropdown-options"
          role="listbox"
          data-testid="atom-select-options-list"
          class="dropdown-options menu-pop-up"
          :aria-label="label"
          :aria-hidden="!isOpen"
        >
          <li
            v-if="
              options &&
              Array.isArray(options) &&
              options.length > 0 &&
              filteredOptions &&
              Array.isArray(filteredOptions) &&
              filteredOptions.length < 1
            "
            class="dropdown-option no-results"
          >
            <a href="#">No results</a>
          </li>
          <li
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            class="dropdown-option"
            :class="{
              selected: selectedOptions.length > 0 && selectedOptions.includes(option),
              ['is-group']: option.filteredChildren && option.filteredChildren.length > 0
            }"
            :id="getOptionId(index)"
            role="option"
            @click="
              option.filteredChildren && option.filteredChildren.length > 0
                ? false
                : selectOption(option)
            "
            @mouseenter="focusOption(index)"
            @keydown.enter="
              option.filteredChildren && option.filteredChildren.length > 0
                ? false
                : selectOption(option)
            "
            :tabindex="option.filteredChildren && option.filteredChildren.length > 0 ? -1 : 0"
            data-testid="atom-select-option"
          >
            <a href="#" tabindex="-1">{{ option.label }}</a>
            <span v-if="option.filteredChildren && option.filteredChildren?.length > 0">
              <span
                v-for="(optionChild, indexChild) in option.filteredChildren"
                :key="optionChild.value"
                class="dropdown-option"
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
  </div>
</template>

<style scoped>
.dropdown {
  position: absolute;
  opacity: 0;
  top: 35px;
  left: 0;
  padding: 0;
  z-index: -1;
  width: 18rem;
  border-radius: 4px;
  transition: opacity 0.2s ease-in-out;
}
.dropdown:after {
  content: '';
  display: block;
  height: 300px;
  width: 100%;
  background-color: transparent;
}
.dropdown.visible {
  display: block;
  opacity: 1;
  z-index: 10;
}

.dropdown .dropdown-search {
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-light);
  background: #fff;
  box-shadow: 0 4px 10px rgba(41, 49, 62, 0.22);
}
.dropdown .dropdown-search input {
  padding-left: 2rem;
}
.dropdown .dropdown-search i {
  position: absolute;
  top: 20px;
  left: 20px;
}

.dropdown-field {
  box-sizing: border-box;
  border-radius: 4px;
  height: 32px;
  background: #dfe4ec;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  width: 100%;
  line-height: 33px;

  transition: outline 0.1s ease-in-out;
}
.dropdown-container.open .dropdown-field {
  outline: 2px solid var(--color-blue-hover);
}

.dropdown-field p {
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 30vw;
}

.dropdown-container.open .dropdown-options {
  display: block;
}

.dropdown-options {
  max-height: 250px;
  max-width: 25rem;
  width: 18rem;
  overflow: auto;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: var(--color-dark);
  list-style: none;
  position: relative;
  flex-direction: column;
  scroll-behavior: auto;
  background: #fff;
  box-shadow: 0 4px 10px rgba(41, 49, 62, 0.22);
}
.dropdown-options::-webkit-scrollbar {
  width: 5px;
}
.dropdown-options::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.dropdown-options::-webkit-scrollbar-thumb {
  background-color: var(--color-dark);
  border-radius: 10px;
}

/*.dropdown-options.has-search {
  padding-top: 0;
}*/

/**
 * All elements
 */
.dropdown-options .dropdown-option {
  position: relative;
  padding: 0.1rem 0;
  font-weight: 500;
}
.dropdown-options .dropdown-option:not(.is-group) {
  border-left: 3px solid transparent;
}
.dropdown-options .dropdown-option a {
  display: flex;
  padding: 0.5rem 1rem;
  color: var(--color-dark);
}
.dropdown-options .dropdown-option > span {
  display: flex;
}

/**
 * Groups header
 */
.dropdown-options .dropdown-option.is-group {
  font-weight: 600;
}
.dropdown-options .dropdown-option.is-group > a,
.dropdown-options .dropdown-option.is-group > a:hover {
  color: var(--color-dark-muted);
  cursor: default;
  text-transform: uppercase;
}
.dropdown-options .dropdown-option.is-group > span {
  color: var(--color-dark);
  cursor: default;
  padding: 0;
}
.dropdown-options .dropdown-option.is-group .dropdown-option {
  padding: 0 1rem;
  flex: 1;
}

/**
 * li elements and children
 */
.dropdown .dropdown-options .dropdown-option:hover:not(.is-group),
.dropdown .dropdown-option.selected,
.dropdown .dropdown-options .dropdown-option.is-group .dropdown-option:hover {
  background-color: var(--color-blue-muted);
  border-color: var(--color-blue-hover);
}
.dropdown-options .dropdown-option:hover:not(.is-group) a,
.dropdown-option.selected a {
  color: var(--color-dark);
}

@media screen and (max-width: 580px) {
  .dropdown-field p {
    max-width: 80vw;
  }
}
</style>
