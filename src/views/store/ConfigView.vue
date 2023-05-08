<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue'

import { useProductStore } from '@/stores/products'

import AtomInput from '@/components/atoms/AtomInput.vue'

export default defineComponent({
  name: 'ProductsView',
  components: { AtomInput },
  setup() {
    const productsStore = useProductStore()

    const configs = computed(() => productsStore.config)

    const productsMaxPrice = ref(configs.value.products.maxPrice)

    watchEffect(() => {
      const newValue = parseInt(String(productsMaxPrice.value))
      if (productsMaxPrice.value && newValue > 0) {
        productsStore.$patch((state) => {
          state.storeConfig.products.maxPrice = newValue
        })
      }
    })

    return {
      productsMaxPrice
    }
  }
})
</script>

<template>
  <section class="ly-row">
    <div class="card">
      <div class="ly-even-2">
        <AtomInput name="maxPrice" v-model="productsMaxPrice" type="number" label="Max price" />
      </div>
    </div>
  </section>
</template>
