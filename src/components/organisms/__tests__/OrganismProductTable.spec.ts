import { render, screen, within } from '@testing-library/vue'
import { createApp } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

import { useProductStore } from '@/stores/products'

import OrganismProductTable from '@/components/organisms/OrganismProductTable.vue'

const app = createApp({})

let store: any

beforeEach(() => {
  const pinia = createPinia()
  app.use(pinia)
  setActivePinia(pinia)
})

function setup() {
  const { debug, rerender } = render(OrganismProductTable, {
    props: {
      id: 'test-modal',
      title: 'Testing modal'
    },
    slots: {
      default: 'modal content test'
    },
    global: {
      plugins: [createTestingPinia({ stubActions: false })]
    }
  })

  return { debug, rerender }
}

describe('OrganismProductTable', () => {
  it('renders', () => {
    setup()

    expect(screen.getByTestId('datatable')).toBeInTheDocument()
  })

  it('renders correctly product rows', async () => {
    setup()

    store = useProductStore()
    store.addProduct({
      name: 'product 1',
      sku: 'product-1',
      price: 123,
      type: 'Fresh produce'
    })

    expect(await screen.findAllByTestId('datatable-tr')).toHaveLength(1)
    const tds = await screen.findAllByTestId('datatable-td')
    expect(tds).toHaveLength(4)
    expect(within(tds[0]).getByTestId('datatable-td-value').innerHTML).toBe('product-1')
  })
})
