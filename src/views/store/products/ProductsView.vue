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

    function goToSettings() {
      push({ name: 'StoreConfig' })
    }

    return {
      goToModal,
      goToDemoModal,
      goToSettings
    }
  }
})
</script>

<template>
  <section class="ly-col">
    <div class="ly-row ly-spacebetween-center px-half">
      <AtomButton @click="goToModal" type="button" class-name="btn btn-primary"
        >Add product</AtomButton
      >
      <div class="ly-row demo-buttons">
        <AtomButton @click="goToDemoModal" type="button" class-name="btn btn-secondary"
          >Show inputs demo</AtomButton
        >
        <AtomButton type="button" @click="goToSettings" class-name="btn">Configurations</AtomButton>
      </div>
    </div>

    <div class="ly-row">
      <OrganismProductTable />
    </div>
  </section>

  <section>
    <RouterView />
  </section>
</template>

<style scoped>
@media screen and (max-width: 580px) {
  .demo-buttons {
    flex-direction: column;
    align-items: center;
  }
  .demo-buttons .btn:first-child {
    margin: 0 0 0.5rem 0;
  }
}
</style>
