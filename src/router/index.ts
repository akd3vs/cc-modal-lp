import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '@/views/store/products/ProductsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'StoreProductsPath' }
    },
    {
      path: '/store',
      name: 'StorePath',
      redirect: { name: 'StoreProductsPath' },
      children: [
        {
          path: '/store/config',
          name: 'StoreConfig',
          component: () => import('../views/store/ConfigView.vue')
        },
        {
          path: '/store/products',
          name: 'StoreProductsPath',
          component: ProductsView,
          children: [
            {
              path: '/store/products/add-product',
              name: 'StoreProductsAddProductPath',
              component: () => import('../views/store/products/AddProductModalView.vue')
            },
            {
              path: '/store/products/demo',
              name: 'demo',
              component: () => import('../views/store/products/InputsDemoModalView.vue')
            }
          ]
        }
      ]
    }
  ]
})

export default router
