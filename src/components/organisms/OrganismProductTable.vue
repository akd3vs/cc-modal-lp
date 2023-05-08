<template>
  <MoleculeDataTable :columns="columns" :data="products" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import MoleculeDataTable from '@/components/molecules/MoleculeDataTable.vue'

import type ProductTypeInterface from '@/interfaces/ProductTypeInterface'

import { useProductStore } from '@/stores/products'

const columns = [
  {
    key: 'sku',
    label: 'SKU'
  },
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'price',
    label: 'Price'
  },
  {
    key: 'type',
    label: 'Category',
    render: (row: string | number | ProductTypeInterface) => {
      if (typeof row === 'object' && Array.isArray(row)) {
        return row.map((r) => r.label).join(', ')
      }

      return String(row)
    }
  }
]

export default defineComponent({
  name: 'OrganismProductTable',
  components: { MoleculeDataTable },
  setup() {
    const productsStore = useProductStore()

    const products = computed(() => productsStore.products)

    return { products, columns }
  }
})
</script>
