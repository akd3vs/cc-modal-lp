import { render, screen } from '@testing-library/vue'

import AtomButton from '@/components/atoms/AtomButton.vue'

function setup(
  config: {
    props?: { type?: 'button' | 'submit' | 'reset' | undefined; className?: string }
    text?: string
  } = {}
) {
  render(AtomButton, {
    props: {
      type: 'button',
      ...config.props
    },
    slots: {
      default: config.text ?? 'Click me'
    }
  })
}

describe('AtomButton', () => {
  it('renders', () => {
    setup()

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('sets button type correctly', () => {
    setup({
      props: {
        type: 'submit'
      }
    })

    expect(screen.getByRole('button').getAttribute('type')).toBe('submit')
  })

  it('sets class correctly', () => {
    setup({
      props: {
        className: 'class-test'
      }
    })

    expect(screen.getByRole('button').getAttribute('class')).toBe('class-test')
  })
})
