import { render, screen, fireEvent } from '@testing-library/vue'

import OrganismsModal from '@/components/organisms/OrganismModal.vue'

function setup() {
  const { debug, emitted } = render(OrganismsModal, {
    props: {
      id: 'test-modal',
      title: 'Testing modal'
    },
    slots: {
      default: 'modal content test'
    }
  })

  return { debug, emitted }
}

describe('OrganismModal', () => {
  it('renders', () => {
    setup()

    expect(screen.getByText('modal content test')).toBeInTheDocument()
  })

  it('handles closing the modal', async () => {
    const { emitted } = setup()

    const closeButton = screen.getByTestId('organism-modal-close-button')

    await fireEvent.click(closeButton)

    expect(emitted()).toHaveProperty('onModalClose')
  })
})
