import React from 'react'
import faker from 'faker'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import Login from './login'
import { ValidationSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMessage = faker.random.words()
  const sut = render(<Login validation={validationSpy}/>)
  return {
    sut,
    validationSpy
  }
}

describe('Login components', () => {
  afterEach(cleanup)
  test('Shold start with initial state of the inputs', () => {
    const { sut, validationSpy } = makeSut()

    const emailStatus = sut.getByTestId('email-status') as HTMLButtonElement
    expect(emailStatus.title).toBe(validationSpy.errorMessage)
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

  test('Shold call Validation with correct value of the email input', () => {
    const { sut, validationSpy } = makeSut()
    const input = sut.getByTestId('email')
    const mockEmail = faker.internet.email()
    fireEvent.input(input, { target: { value: mockEmail } })
    expect(validationSpy.filedName).toBe('email')
    expect(validationSpy.fieldValue).toBe(mockEmail)
  })

  test('Shold call Validation with correct value of the password input', () => {
    const { sut, validationSpy } = makeSut()
    const input = sut.getByTestId('password')
    const mockPassword = faker.internet.password()
    fireEvent.input(input, { target: { value: mockPassword } })
    expect(validationSpy.filedName).toBe('password')
    expect(validationSpy.fieldValue).toBe(mockPassword)
  })

  test('Shold show message of error when a email input filled wrong', () => {
    const { sut, validationSpy } = makeSut()
    const input = sut.getByTestId('email')
    fireEvent.input(input, { target: { value: faker.internet.email() } })
    const status = sut.getByTestId('email-status')
    expect(status.title).toBe(validationSpy.errorMessage)
    expect(status.textContent).toBe('🔴')
  })
})
