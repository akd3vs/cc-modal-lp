import { defineStore } from 'pinia'

import type ProductInterface from '@/interfaces/ProductInterface'
import type ProductTypeInterface from '@/interfaces/ProductTypeInterface'

import productTypes from '@/data/productTypes'

export type RootState = {
  productList: ProductInterface[]
  productTypes: ProductTypeInterface[]
  storeConfig: {
    products: {
      maxPrice: number
    }
  }
}

export const useProductStore = defineStore({
  id: 'products',
  state: (): RootState => ({
    productList: [],
    productTypes,
    storeConfig: {
      products: {
        maxPrice: parseInt(import.meta.env.VITE_STORE_ADD_PRODUCT_MAX_PRICE)
      }
    }
  }),
  getters: {
    products: (state) => state.productList,
    types: (state) => state.productTypes,
    config: (state) => state.storeConfig
  },
  actions: {
    addProduct(product: ProductInterface) {
      this.products.push(product)
    }
  }
})
