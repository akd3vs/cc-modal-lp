<template>
  <button :type="type" :class="className">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type: 'button' | 'submit' | 'reset' | undefined
  className?: String
}>()
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AtomButton'
})
</script>
