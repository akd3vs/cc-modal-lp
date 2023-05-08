<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useProductStore } from '@/stores/products'

import type ProductInterface from '@/interfaces/ProductInterface'
import type ProductTypeInterface from '@/interfaces/ProductTypeInterface'

import OrganismModal from '@/components/organisms/OrganismModal.vue'
import AtomInput from '@/components/atoms/AtomInput.vue'
import AtomSelect from '@/components/atoms/AtomSelect.vue'
import AtomButton from '@/components/atoms/AtomButton.vue'

export default defineComponent({
  name: 'ModalView',
  components: { OrganismModal, AtomInput, AtomSelect, AtomButton },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const path = computed(() => route.matched[route.matched.length - 2].path)
    const productsStore = useProductStore()

    const formInputName = ref('')
    const formInputSku = ref('')
    const formInputPrice = ref()
    const formInputType = ref<ProductTypeInterface>()

    const isValidFormInputName = ref(false)
    const isValidFormInputSku = ref(false)
    const isValidFormInputPrice = ref(false)
    const isValidFormInputType = ref(false)

    const productTypes = computed(() => productsStore.types)

    const maxPrice = computed(() => productsStore.config.products.maxPrice)

    function onModalClose() {
      router.push(path.value)
    }

    function submit() {
      if (formInputType.value && 'value' in formInputType.value && 'label' in formInputType.value) {
        const newProduct: ProductInterface = {
          name: formInputName.value,
          sku: formInputSku.value,
          price: formInputPrice.value,
          type: formInputType.value
        }

        productsStore.addProduct(newProduct)

        onModalClose()
      }
    }

    const isFormValid = computed(() => {
      return (
        isValidFormInputName.value &&
        isValidFormInputSku.value &&
        isValidFormInputPrice.value &&
        isValidFormInputType.value
      )
    })

    function skuValidator(value: string) {
      const regexp = /^[a-zA-Z0-9-_]+$/
      return value.search(regexp) !== -1
    }

    return {
      onModalClose,
      submit,
      isFormValid,
      formInputName,
      formInputSku,
      formInputPrice,
      formInputType,
      productTypes,
      maxPrice,
      skuValidator,
      isValidFormInputName,
      isValidFormInputSku,
      isValidFormInputPrice,
      isValidFormInputType
    }
  }
})
</script>

<template>
  <OrganismModal
    id="modal-view"
    show
    title="Adding a product"
    size="md"
    @on-modal-close="onModalClose"
  >
    <form class="ly-even-2" @submit.prevent="submit">
      <div>
        <AtomInput
          name="name"
          class-names="form-field"
          label="Name"
          helper="E.g. Seafood Pizza."
          maxlength="80"
          v-model="formInputName"
          v-model:is-valid="isValidFormInputName"
          error-message="Specify a valid name"
          required
          autofocus
        />
      </div>
      <div>
        <AtomInput
          name="price"
          class-names="form-field"
          label="Price"
          v-model="formInputPrice"
          v-model:is-valid="isValidFormInputPrice"
          type="text"
          currency-symbol="$"
          currency="USD"
          :max="maxPrice"
          min="1.05"
          fraction-digits="2"
          error-message="You must specify a valid price between {min} and {max}"
          required
        />
      </div>
      <div>
        <AtomInput
          name="sku"
          class-names="form-field"
          label="SKU"
          v-model="formInputSku"
          v-model:is-valid="isValidFormInputSku"
          :validator="skuValidator"
          error-message="You must specify a valid SKU"
          helper="Only alphanumeric characters and dashes."
          required
        />
      </div>
      <div>
        <AtomSelect
          name="type"
          class-names="form-field"
          label="Type"
          v-model="formInputType"
          v-model:is-valid="isValidFormInputType"
          :options="productTypes"
          error-message="You must specify a product type"
          empty-label="Select one"
          required
        />
      </div>
      <div></div>
      <div class="p2 ly-row ly-end-center">
        <AtomButton type="button" @click="onModalClose">Cancel</AtomButton>
        <AtomButton type="submit" class-name="btn-primary" :disabled="!isFormValid"
          >Submit</AtomButton
        >
      </div>
    </form>
  </OrganismModal>
</template>
