import { render, screen, fireEvent, within } from '@testing-library/vue'
import user from '@testing-library/user-event'

import AtomInput from '@/components/atoms/AtomInput.vue'

function setup(
  config: {
    props?: {
      type?: string
      name?: string
      modelValue?: string
      label?: string
      fractionDigits?: string
      currency?: string
      currencySymbol?: string
      required?: boolean
      errorMessage?: string
      max?: string
      min?: string
      autofocus?: boolean
      validator?: (value: string) => boolean
      minlength?: string
      maxlength?: string
    }
  } = {}
) {
  const { debug, emitted, rerender } = render(AtomInput, {
    props: {
      label: 'test input',
      ...config.props
    }
  })

  const input: HTMLInputElement = screen.getByTestId('atom-input')
  const label = screen.getByTestId('input-label')

  return {
    input,
    label,
    debug,
    emitted,
    rerender
  }
}

describe('AtomInput', () => {
  it('renders', () => {
    const { input } = setup()

    expect(input).toBeInTheDocument()
  })

  it('handles decimal', async () => {
    const { input } = setup({
      props: {
        type: 'number',
        fractionDigits: '3'
      }
    })

    await fireEvent.update(input, '3.141')
    await fireEvent.blur(input)

    expect(input).toHaveValue(3.141)
  })

  it('handles currency', async () => {
    const { input, label } = setup({
      props: {
        type: 'text',
        currency: 'USD',
        currencySymbol: '$',
        fractionDigits: '3'
      }
    })

    await fireEvent.update(input, '3.141')
    await fireEvent.blur(input)

    expect(input).toHaveValue('3.141')

    const helper = within(label).getByRole('contentinfo')

    expect(helper.innerHTML).toBe('$')
  })

  it('handles required and shows an error message', async () => {
    const { input } = setup({
      props: {
        type: 'text',
        required: true,
        errorMessage: 'need to specify a value'
      }
    })

    await fireEvent.update(input, 'test')
    await fireEvent.blur(input)

    expect(await screen.queryByTestId('input-error-message')).not.toBeInTheDocument()

    await fireEvent.update(input, '')
    await fireEvent.blur(input)

    const errorMessage = await screen.queryByTestId('input-error-message')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage?.innerHTML).toBe('need to specify a value')
  })

  it('handles max', async () => {
    user.setup()
    const { input } = setup({
      props: {
        type: 'number',
        max: '200',
        required: true
      }
    })

    await user.type(input, '300')

    expect(input).toHaveValue(200)
  })

  it('handles min', async () => {
    const { input } = setup({
      props: {
        type: 'number',
        min: '100',
        errorMessage: 'min is {min}'
      }
    })

    await user.type(input, '5')

    const minError = await screen.queryByTestId('input-error-message')
    expect(minError).toBeInTheDocument()
    expect(minError?.innerHTML).toBe('min is 100')
  })

  it('handles custom validation', async () => {
    const { input } = setup({
      props: {
        type: 'text',
        autofocus: true,
        validator: (value) => value.includes('  '),
        errorMessage: 'need a value with 2 spaces'
      }
    })

    await fireEvent.update(input, '  test')
    await fireEvent.blur(input)

    expect(await screen.queryByTestId('input-error-message')).not.toBeInTheDocument()

    await fireEvent.update(input, 'test')
    await fireEvent.blur(input)

    expect(input).toHaveValue('')

    const errorMessage = await screen.queryByTestId('input-error-message')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage?.innerHTML).toBe('need a value with 2 spaces')
  })

  it('handles min and max length', async () => {
    const { input, rerender } = setup({
      props: {
        type: 'text',
        minlength: '2',
        maxlength: '80',
        errorMessage: 'Need a message more than 2 and less than 80'
      }
    })

    await fireEvent.update(input, '1')
    await fireEvent.blur(input)

    const errorMessage = await screen.queryByTestId('input-error-message')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage?.innerHTML).toBe('Need a message more than 2 and less than 80')

    await fireEvent.change(input, { target: { value: '1234567890' } })

    expect(input).toHaveValue('1234567890')
    // expect(emitted()).toHaveProperty('update:modelValue')
    // expect(emitted()['update:modelValue']).toBe('update:modelValue')

    await rerender({
      modelValue: '1234567890'
    })

    const counter = screen.getByTestId('input-counter')

    expect(counter.innerHTML).toBe('10/80')
  })
})
