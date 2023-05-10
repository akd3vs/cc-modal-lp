<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import OrganismModal from '@/components/organisms/OrganismModal.vue'
import AtomInput from '@/components/atoms/AtomInput.vue'
import AtomSelect from '@/components/atoms/AtomSelect.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'

import { useProductStore } from '@/stores/products'

import productTypesPlain from '@/data/productTypesPlain'

export default defineComponent({
  name: 'ModalView',
  components: { OrganismModal, AtomInput, AtomSelect, AtomButton },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const path = computed(() => route.matched[route.matched.length - 2].path)
    const productsStore = useProductStore()

    const productTypes = computed(() => productsStore.types)

    function onModalClose() {
      router.push(path.value)
    }

    return {
      onModalClose,
      productTypes,
      productTypesPlain
    }
  }
})
</script>

<template>
  <OrganismModal id="modal-view" show title="Inputs demo" size="md" @on-modal-close="onModalClose">
    <form class="ly-col" @submit.prevent="">
      <div>
        <AtomInput
          name="name"
          type="number"
          class-names="form-field"
          label="Number decimal"
          max="3.141592"
          fraction-digits="6"
          error-message="Invalid input"
          required
          autofocus
        />
      </div>
      <div>
        <AtomInput
          name="price"
          class-names="form-field"
          label="Integer"
          type="number"
          min="1"
          max="100"
          error-message="You must specify a valid value between {min} and {max}"
          required
        />
      </div>
      <div>
        <AtomInput
          name="price"
          class-names="form-field"
          label="Currency"
          type="text"
          currency="USD"
          currency-symbol="$"
          min="1"
          max="100"
          error-message="You must specify a valid value between {min} and {max}"
          required
        />
      </div>
      <div>
        <AtomInput
          name="sku"
          class-names="form-field"
          label="SKU"
          error-message="You must specify a valid value"
          helper="Only alphanumeric characters and dashes."
          required
        />
      </div>
      <div>
        <AtomSelect
          name="type"
          class-names="form-field"
          label="Type"
          :options="productTypes"
          error-message="You must specify a product type"
          empty-label="Select one"
          required
          multiple
        />
      </div>
      <div>
        <AtomSelect
          name="type"
          class-names="form-field"
          label="Type w/o children"
          :options="productTypesPlain"
          error-message="You must specify a product type"
          empty-label="Select one"
          required
        />
      </div>
      <div>
        <AtomSelect
          name="type"
          class-names="form-field"
          label="Type w/o search"
          :options="productTypesPlain"
          error-message="You must specify a product type"
          empty-label="Select one"
          required
          :with-search="false"
        />
      </div>
      <div></div>
      <div class="p2 ly-row ly-end-center">
        <AtomButton type="button" @click="onModalClose">Cancel</AtomButton>
        <AtomButton type="submit" class-name="btn-primary">Submit</AtomButton>
      </div>
    </form>
  </OrganismModal>
</template>
