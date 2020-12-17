import React from 'react'
import faker from 'faker'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import Login from './login'
import { ValidationStub } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  validationStub: ValidationStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = faker.random.words()
  const sut = render(<Login validation={validationStub}/>)
  return {
    sut,
    validationStub
  }
}

describe('Login components', () => {
  afterEach(cleanup)
  test('Shold start with initial state of the inputs', () => {
    const { sut, validationStub } = makeSut()

    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationStub.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationStub.errorMessage)
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

  test('Shold show message of error when a email input filled wrong', () => {
    const { sut, validationStub } = makeSut()
    const input = sut.getByTestId('email')
    fireEvent.input(input, { target: { value: faker.internet.email() } })
    const status = sut.getByTestId('email-status')
    expect(status.title).toBe(validationStub.errorMessage)
    expect(status.textContent).toBe('🔴')
  })

  test('Shold show message of error when a password input filled wrong', () => {
    const { sut, validationStub } = makeSut()
    const input = sut.getByTestId('password')
    fireEvent.input(input, { target: { value: faker.internet.password() } })
    const status = sut.getByTestId('password-status')
    expect(status.title).toBe(validationStub.errorMessage)
    expect(status.textContent).toBe('🔴')
  })

  test('Shold show valid email state when Validation has succeeds', () => {
    const { sut, validationStub } = makeSut()
    validationStub.errorMessage = null
    const input = sut.getByTestId('email')
    fireEvent.input(input, { target: { value: faker.internet.email() } })
    const status = sut.getByTestId('email-status')
    expect(status.title).toBe('Tudo certo!')
    expect(status.textContent).toBe('🔵')
  })

  test('Shold show valid password state when Validation has succeeds', () => {
    const { sut, validationStub } = makeSut()
    validationStub.errorMessage = null
    const input = sut.getByTestId('password')
    fireEvent.input(input, { target: { value: faker.internet.password() } })
    const status = sut.getByTestId('password-status')
    expect(status.title).toBe('Tudo certo!')
    expect(status.textContent).toBe('🔵')
  })

  test('Shold enable submit button if form is valid', () => {
    const { sut, validationStub } = makeSut()
    validationStub.errorMessage = null
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const submit = sut.getByTestId('submit') as HTMLButtonElement
    expect(submit.disabled).toBe(false)
  })
})
