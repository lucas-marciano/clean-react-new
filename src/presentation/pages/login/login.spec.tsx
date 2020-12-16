import React from 'react'
import { render } from '@testing-library/react'
import Login from './login'

describe('Login components', () => {
  test('Shold start with initial state of the inputs', () => {
    const { getByTestId } = render(<Login />)

    const emailStatus = getByTestId('email-status') as HTMLButtonElement
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = getByTestId('password-status') as HTMLButtonElement
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Shold start with initial state of the button', () => {
    const { getByTestId } = render(<Login />)
    const submit = getByTestId('submit') as HTMLButtonElement

    expect(submit.disabled).toBe(true)
  })

  test('Shold not render the loading and error message when initialize the view', () => {
    const { getByTestId } = render(<Login />)
    const errorWrap = getByTestId('error-wrap')

    expect(errorWrap.childElementCount).toBe(0)
  })
})
