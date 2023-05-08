import { render, screen, fireEvent, within } from '@testing-library/vue'
import user from '@testing-library/user-event'

import AtomSelect from '@/components/atoms/AtomSelect.vue'

import options from '@/data/productTypes'

function setup(
  config: {
    props?: {
      multiple: boolean
    }
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

    let childrenLength = 0

    options.forEach((option) => {
      if (option.children) {
        childrenLength += option.children.length
      }
    })

    expect(optionsElements).toHaveLength(options.length + childrenLength)

    await userEvent.click(optionsElements[2])

    const selectedOptionLabel = screen.getByTestId('atom-select-selected-option')

    expect(selectedOptionLabel.innerHTML).toBe(options[1].label)
  })

  it('handles correctly clicking in a group', async () => {
    const { input, container } = setup()
    const userEvent = user.setup()

    await userEvent.click(input)

    const optionsElements = within(container).getAllByTestId('atom-select-option')

    await userEvent.click(optionsElements[0])

    const selectedOptionLabel = screen.getByTestId('atom-select-selected-option')

    expect(selectedOptionLabel.innerHTML).toBe('Select option')
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

  it('handles correctly multiple selection', async () => {
    const { input, container } = setup({
      props: {
        multiple: true
      }
    })
    const userEvent = user.setup()

    await userEvent.click(input)

    const optionsElements = within(container).getAllByTestId('atom-select-option')

    await userEvent.click(optionsElements[1])
    await userEvent.click(optionsElements[2])

    const selectedOptionLabel = screen.getByTestId('atom-select-selected-option')

    if (options[0].children) {
      expect(selectedOptionLabel.innerHTML).toBe(
        `${options[0].children[0].label}, ${options[1].label}`
      )
    }
  })
})
