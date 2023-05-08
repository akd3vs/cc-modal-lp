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
  name: 'AtomSelectPoc',
  props: {
    options: {
      type: Array as () => AtomSelectProps['options'],
      required: true
    },
    label: {
      type: String,
      required: false,
      default: null
    }
  },

  setup(props, { emit }) {
    const id = `dropdown-${Math.random().toString(36).substring(2, 15)}`
    const isOpen = ref(false)
    const selectedOption = ref<AtomSelectOption>()
    const searchTerm = ref('')
    const focusedIndex = ref(-1)
    const searchInputRef = ref<HTMLInputElement>()

    const filteredOptions = computed(() => {
      return props.options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    })

    const getOptionId = (index: number) => {
      return `${id}-option-${index}`
    }

    const getActiveDescendantId = computed(() => {
      return focusedIndex.value >= 0 ? getOptionId(focusedIndex.value) : undefined
    })

    const openDropdown = () => {
      isOpen.value = true
      nextTick(() => {
        if (searchInputRef.value && 'focus' in searchInputRef.value) {
          searchInputRef.value.focus()
        }
      })
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
      const { closest } = <HTMLElement>event.target
      if (!closest('.dropdown-container')) {
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
      id,
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
  <div class="dropdown menu-container">
    <label :for="id" class="dropdown-label">{{ label }}</label>
    <select @click.stop="openDropdown" class="dropdown-select">
      <option v-if="!selectedOption">Select option</option>
      <option v-if="selectedOption">{{ selectedOption.label }}</option>
    </select>
    <div :class="{ 'dropdown-container': true, 'dropdown-open': isOpen }">
      <ul
        id="dropdown-options"
        :class="{ 'dropdown-options menu-pop-up': true, visible: isOpen }"
        role="listbox"
        :aria-label="label"
        :aria-hidden="!isOpen"
      >
        <li>
          <input
            :id="id"
            class="dropdown-input"
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
          />
        </li>
        <li
          v-for="(option, index) in filteredOptions"
          :key="option.value"
          class="dropdown-option"
          :class="{ selected: selectedOption === option }"
          :id="getOptionId(index)"
          role="option"
          @click="selectOption(option)"
          @mouseenter="focusOption(index)"
        >
          <a href="#">{{ option.label }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dropdown-select * {
  appearance: none;
  display: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  border: 0;
}
.dropdown-container:not(.dropdown-open) {
  display: none;
}
.dropdown-container:is(.dropdown-open) .dropdown-options {
  top: 55px;
}
</style>
