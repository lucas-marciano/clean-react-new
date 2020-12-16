import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Login from './login'

type SutTypes = {
  sut: RenderResult
}

const makeSut = (): SutTypes => {
  const sut = render(<Login />)

  return {
    sut
  }
}

describe('Login components', () => {
  test('Shold start with initial state of the inputs', () => {
    const { sut } = makeSut()

    const emailStatus = sut.getByTestId('email-status') as HTMLButtonElement
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = sut.getByTestId('password-status') as HTMLButtonElement
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Shold start with initial state of the button', () => {
    const { sut } = makeSut()
    const submit = sut.getByTestId('submit') as HTMLButtonElement

    expect(submit.disabled).toBe(true)
  })

  test('Shold not render the loading and error message when initialize the view', () => {
    const { sut } = makeSut()
    const errorWrap = sut.getByTestId('error-wrap')

    expect(errorWrap.childElementCount).toBe(0)
  })
})
