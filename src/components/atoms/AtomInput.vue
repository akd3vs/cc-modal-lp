<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'

export default defineComponent({
  name: 'AtomInput',
  props: {
    type: {
      type: String,
      required: false,
      default: 'text',
      validator: (value: string) => {
        return ['text', 'number', 'url', 'email', 'password'].includes(value)
      }
    },
    modelValue: {
      type: [String, Number],
      required: false,
      default: null
    },
    name: {
      type: String,
      required: false,
      default: null
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    min: {
      type: [String, Number],
      required: false,
      default: null
    },
    max: {
      type: [String, Number],
      required: false,
      default: null
    },
    minlength: {
      type: [String, Number],
      required: false,
      default: 0
    },
    maxlength: {
      type: [String, Number],
      required: false,
      default: null
    },
    autocomplete: {
      type: String,
      required: false,
      default: 'off'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: null
    },
    readonly: {
      type: Boolean,
      required: false,
      default: null
    },
    pattern: {
      type: String,
      required: false,
      default: null
    },
    classNames: {
      type: String,
      required: false,
      default: null
    },
    label: {
      type: String,
      required: false,
      default: null
    },
    autofocus: {
      type: Boolean,
      required: false,
      default: false
    },
    helper: {
      type: String,
      required: false,
      default: null
    },
    currencySymbol: {
      type: String,
      required: false,
      default: null
    },
    currency: {
      type: String,
      required: false,
      default: null
    },
    validator: {
      type: Function,
      required: false,
      default: null
    },
    errorMessage: {
      type: String,
      required: false,
      default: null
    },
    isValid: {
      type: Boolean,
      required: false
    },
    fractionDigits: {
      type: String,
      required: false,
      default: '0'
    }
  },

  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement>()
    const inputError = ref(false)

    /**
     * This is where we specify input format and some validation rules
     * @param e
     */
    function onInput(e: Event) {
      let formattedValue = (e.target as HTMLInputElement).value

      // on input we clear the error
      inputError.value = false

      // @todo: support currencies that separate numbers with point instead of coma
      // if we're handling currency, we need to clear the comas
      if (props.currency && props.currencySymbol && formattedValue.trim() !== '') {
        formattedValue = formattedValue.replace(/,/g, '')
      }

      // if it's required and we have no value or empty values, let's show the error
      if (
        (props.required && typeof formattedValue === 'string' && formattedValue.trim() === '') ||
        (typeof formattedValue === 'number' && !formattedValue)
      ) {
        inputError.value = true
      }

      // if we have min value (number), we compare it with the value and if it's less than, show an error
      if (props.min && parseFloat(formattedValue) < parseFloat(props.min as string)) {
        inputError.value = true
      }

      // same but with text
      if (props.minlength && formattedValue.trim().length < parseInt(props.minlength as string)) {
        inputError.value = true
      }

      // if we have max value (number), we compare it with the value and if it's more than, show an error
      if (props.max && parseFloat(formattedValue) > parseFloat(props.max as string)) {
        formattedValue = props.max as string
      }

      // after all the validations, if we're dealing with currency, let's format it, but if the user is entering their decimals, we shall not interrupt it
      // if (props.currency && props.currencySymbol && formattedValue) {
      //   if (!`${formattedValue}`.includes('.')) {
      //     const numberFormat = new Intl.NumberFormat('default', {
      //       style: 'decimal',
      //       currency: props.currency,
      //       maximumFractionDigits: 0
      //     })
      //     let numberParsed = parseFloat(formattedValue)
      //     if (Number.isNaN(numberParsed)) {
      //       numberParsed = 0
      //     }
      //     formattedValue = numberFormat.format(numberParsed)
      //   }
      // }

      emit('update:modelValue', formattedValue)
      if (inputRef.value && 'value' in inputRef.value) {
        inputRef.value.value = formattedValue
      }

      if (props.validator && !props.validator(formattedValue)) {
        inputError.value = true
      }

      emit('update:isValid', !inputError.value)

      return false
    }

    function onBlur(e: Event) {
      const value = (e.target as HTMLInputElement).value
      if (value.trim() !== '') {
        let formattedValue = value

        if (props.type === 'number' || props.currency) {
          formattedValue = value.replace(/,/g, '')
        }

        if (props.max && parseFloat(formattedValue) > parseFloat(props.max as string)) {
          formattedValue = props.max as string
        }

        if (props.currency) {
          // onBlur, we need to format with decimals if we're dealing with currency
          const numberFormat = new Intl.NumberFormat('default', {
            style: 'decimal',
            currency: props.currency ?? undefined,
            maximumFractionDigits: parseInt((props.fractionDigits as string) || '0'),
            minimumFractionDigits: parseInt((props.fractionDigits as string) || '0')
          })
          let numberParsed = parseFloat(formattedValue)
          if (Number.isNaN(numberParsed)) {
            numberParsed = 0
          }
          formattedValue = numberFormat.format(numberParsed)
        }

        emit('update:modelValue', formattedValue)
      }
    }

    function handleFocus() {
      if (props.autofocus && inputRef.value && 'focus' in inputRef.value) {
        inputRef.value.focus()
      }
    }

    onMounted(handleFocus)

    const valueLength = computed(() => `${props.modelValue}`.length)

    const minFormatted = computed<string>(() =>
      new Intl.NumberFormat('en-US', {
        style: props.currency ? 'currency' : 'decimal',
        currency: props.currency ?? undefined,
        maximumFractionDigits: parseInt(props.fractionDigits || '0')
      }).format(parseFloat(props.min as string))
    )

    const maxFormatted = computed<string>(() =>
      new Intl.NumberFormat('en-US', {
        style: props.currency ? 'currency' : 'decimal',
        currency: props.currency ?? undefined,
        maximumFractionDigits: parseInt(props.fractionDigits || '0')
      }).format(parseFloat(props.max as string))
    )

    /**
     * We want to not repeat numbers and update min and max, and in the future, more props, so we can show in the error message for reference
     */
    const errorMessageParsed = computed(() => {
      if (props.errorMessage) {
        return props.errorMessage
          .replace('{min}', minFormatted.value)
          .replace('{max}', maxFormatted.value)
      }

      return null
    })

    return {
      onInput,
      onBlur,
      inputRef,
      valueLength,
      maxFormatted,
      inputError,
      errorMessageParsed
    }
  }
})
</script>

<template>
  <label class="input-label" data-testid="input-label">
    {{ label }}
    <span class="ly-row ly-start-center">
      <span
        v-if="currencySymbol"
        class="input-helper font-weight-bold px-half"
        role="contentinfo"
        aria-roledescription="currency symbol"
        >{{ currencySymbol }}</span
      >
      <input
        :type="type"
        :value="modelValue"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :min="min"
        :max="max"
        :minlength="minlength"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :readonly="readonly"
        :pattern="pattern"
        :class="{ classNames, 'pl-2': currency, input: true }"
        :autofocus="autofocus"
        @input="onInput"
        @blur="onBlur"
        ref="inputRef"
        data-testid="atom-input"
      />
    </span>
    <span
      v-if="inputError"
      class="ly-row ly-spacebetween-center pt-half text-error"
      aria-roledescription="error message"
      data-testid="input-error-message"
      >{{ errorMessageParsed }}</span
    >
    <span class="ly-row ly-spacebetween-center py-half">
      <span v-if="helper || max" class="text-dark-muted" data-testid="input-helper">{{
        helper || `Max is: ${maxFormatted}`
      }}</span>
      <span v-if="maxlength" data-testid="input-counter">{{ valueLength }}/{{ maxlength }}</span>
    </span>
  </label>
</template>

<style scoped>
.input-helper {
  position: absolute;
}
.input-label .input {
  line-height: 33px;
}
input {
  transition: outline 0.1s ease-in-out;
  outline: 0 solid var(--color-blue-hover);
}
input:hover {
  outline-width: 1px;
}
input:focus {
  outline-width: 2px;
}
</style>
