import type ProductTypeInterface from '@/interfaces/ProductTypeInterface'

export default interface ProductInterface {
  name: string
  sku: string
  price: number
  type: ProductTypeInterface[]
}
