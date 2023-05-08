<script lang="ts">
import { defineComponent, ref, watchEffect, computed, nextTick } from 'vue'

export interface AtomSelectOption {
  value: string | number
  label: string
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
    }
  },
  setup(props, { emit }) {
    const isOpen = ref(false)
    const selectedOption = ref<AtomSelectOption>()
    const searchTerm = ref('')
    const focusedIndex = ref(-1)
    const searchInputRef = ref<HTMLInputElement>()

    const filteredOptions = computed<AtomSelectOption[]>(() => {
      return props.options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    })

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
      selectedOption.value = option
      emit('update:modelValue', option)
      emit('update:isValid', true)
      closeDropdown()
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
      selectedOption,
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
        <p v-if="selectedOption" data-testid="atom-select-selected-option">
          {{ selectedOption.label }}
        </p>
        <p v-if="!selectedOption" data-testid="atom-select-selected-option">{{ emptyLabel }}</p>
        <i :class="{ 'lpi-caret-up': isOpen, 'lpi-caret-down': !isOpen }"></i>
      </div>

      <ul
        id="dropdown-options"
        role="listbox"
        data-testid="atom-select-options-list"
        :class="{ 'dropdown-options menu-pop-up': true, visible: isOpen }"
        :aria-label="label"
        :aria-hidden="!isOpen"
      >
        <li>
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
          :class="{ selected: selectedOption && selectedOption === option }"
          :id="getOptionId(index)"
          role="option"
          @click="selectOption(option)"
          @mouseenter="focusOption(index)"
          @keydown.enter="selectOption(option)"
          tabindex="0"
          data-testid="atom-select-option"
        >
          <a href="#" tabindex="-1">{{ option.label }}</a>
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
}

.dropdown-container:is(.open) .dropdown-options {
  top: 35px;
}

.dropdown-options li:hover:not(:first-child) {
  background-color: var(--color-blue-hover);
}
</style>
