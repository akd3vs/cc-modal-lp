<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { useProductStore } from '@/stores/products'

import AtomInput from '@/components/atoms/AtomInput.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'

export default defineComponent({
  name: 'ProductsView',
  components: { AtomButton, AtomInput },
  setup() {
    const router = useRouter()
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

    function goToProducts() {
      router.push({ name: 'StoreProductsPath' })
    }

    return {
      productsMaxPrice,
      goToProducts
    }
  }
})
</script>

<template>
  <section class="ly-col px-2">
    <div class="ly-row">
      <AtomButton type="button" @click="goToProducts" class-name="btn">Go to Products</AtomButton>
    </div>
    <div class="card">
      <div class="ly-even-2">
        <AtomInput name="maxPrice" v-model="productsMaxPrice" type="number" label="Max price" />
      </div>
    </div>
  </section>
</template>
