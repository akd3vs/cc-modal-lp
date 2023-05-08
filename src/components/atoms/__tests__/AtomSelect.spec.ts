import { render, screen, fireEvent, within } from '@testing-library/vue'
import user from '@testing-library/user-event'

import AtomSelect from '@/components/atoms/AtomSelect.vue'

import options from '@/data/productTypes'

function setup(
  config: {
    props?: {}
  } = {}
) {
  const {
    debug,
    emitted,
    rerender,
    container: renderContainer
  } = render(AtomSelect, {
    props: {
      name: 'test-select',
      options,
      ...config.props
    }
  })

  const input: HTMLInputElement = screen.getByTestId('atom-select')
  const label = screen.getByTestId('input-label')
  const container = screen.getByTestId('atom-select-container')

  return {
    container,
    input,
    label,
    debug,
    emitted,
    rerender,
    renderContainer
  }
}

describe('AtomSelect', () => {
  it('renders', () => {
    const { input } = setup()

    expect(input).toBeInTheDocument()
  })

  it('can select an option', async () => {
    const { input, container } = setup()
    const userEvent = user.setup()

    await userEvent.click(input)

    const optionsElements = within(container).getAllByTestId('atom-select-option')

    expect(optionsElements).toHaveLength(options.length)

    await userEvent.click(optionsElements[0])

    const selectedOptionLabel = screen.getByTestId('atom-select-selected-option')

    expect(selectedOptionLabel.innerHTML).toBe('Fresh produce')
  })

  it('closes when clicking outside', async () => {
    const { input, renderContainer, container } = setup()
    const userEvent = user.setup()

    await userEvent.click(input)

    await userEvent.click(renderContainer)

    const optionsList = within(container).getByTestId('atom-select-options-list')

    expect(Array.from(optionsList.classList)).not.toContain('visible')
  })

  it('handles search', async () => {
    const { input, container } = setup()
    const userEvent = user.setup()

    await userEvent.click(input)

    const searchInput = screen.getByTestId('atom-select-search-input')

    await userEvent.type(searchInput, 'meat')

    const optionsElements = within(container).getAllByTestId('atom-select-option')

    await userEvent.click(optionsElements[0])

    const selectedOptionLabel = screen.getByTestId('atom-select-selected-option')

    expect(selectedOptionLabel.innerHTML).toBe('Meat')
  })
})
