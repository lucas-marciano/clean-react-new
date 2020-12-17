import React from 'react'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import Login from './login'
import { Validation } from '@/presentation/protocols/validation'

class ValidationSpy implements Validation {
  errorMessage: string
  filedName: string
  fieldValue: string
  validate (filedName: string, fieldValue: string): string {
    this.filedName = filedName
    this.fieldValue = fieldValue
    return this.errorMessage
  }
}

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = render(<Login validation={validationSpy}/>)
  return {
    sut,
    validationSpy
  }
}

describe('Login components', () => {
  afterEach(cleanup)
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

  test('Shold call Validation with correct value of the email input', () => {
    const { sut, validationSpy } = makeSut()
    const input = sut.getByTestId('email')
    fireEvent.input(input, { target: { value: 'any_email' } })
    expect(validationSpy.filedName).toBe('email')
    expect(validationSpy.fieldValue).toBe('any_email')
  })

  test('Shold call Validation with correct value of the password input', () => {
    const { sut, validationSpy } = makeSut()
    const input = sut.getByTestId('password')
    fireEvent.input(input, { target: { value: 'any_password' } })
    expect(validationSpy.filedName).toBe('password')
    expect(validationSpy.fieldValue).toBe('any_password')
  })
})
