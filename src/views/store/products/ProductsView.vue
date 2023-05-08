<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter, RouterView } from 'vue-router'

import AtomButton from '@/components/atoms/AtomButton.vue'
import OrganismProductTable from '@/components/organisms/OrganismProductTable.vue'

export default defineComponent({
  name: 'ProductsView',
  components: { AtomButton, OrganismProductTable, RouterView },
  setup() {
    const { push } = useRouter()
    function goToModal() {
      push({ name: 'StoreProductsAddProductPath' })
    }

    function goToDemoModal() {
      push({ name: 'demo' })
    }

    return {
      goToModal,
      goToDemoModal
    }
  }
})
</script>

<template>
  <section class="ly-col">
    <div class="ly-row ly-spacebetween-center">
      <AtomButton @click="goToModal" type="button" class-name="btn btn-primary"
        >Add product</AtomButton
      >
      <AtomButton @click="goToDemoModal" type="button" class-name="btn btn-secondary"
        >Show inputs demo</AtomButton
      >
    </div>

    <div class="ly-row">
      <OrganismProductTable />
    </div>
  </section>

  <section>
    <RouterView />
  </section>
</template>
