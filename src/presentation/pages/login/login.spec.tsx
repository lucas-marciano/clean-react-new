import React from 'react'
import faker from 'faker'
import { cleanup, fireEvent, render, RenderResult } from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
}

type SutParam = {
  validationError: string
}

const makeSut = (params?: SutParam): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const sut = render(<Login validation={validationStub} authentication={authenticationSpy}/>)
  return {
    sut,
    authenticationSpy
  }
}

describe('Login components', () => {
  afterEach(cleanup)
  test('Shold start with initial state of the inputs', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Shold start with initial state of the button', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    const submit = sut.getByTestId('submit') as HTMLButtonElement

    expect(submit.disabled).toBe(true)
  })

  test('Shold not render the loading and error message when initialize the view', () => {
    const { sut } = makeSut()
    const errorWrap = sut.getByTestId('error-wrap')

    expect(errorWrap.childElementCount).toBe(0)
  })

  test('Shold show message of error when a email input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    const input = sut.getByTestId('email')
    fireEvent.input(input, { target: { value: faker.internet.email() } })
    const status = sut.getByTestId('email-status')
    expect(status.title).toBe(validationError)
    expect(status.textContent).toBe('🔴')
  })

  test('Shold show message of error when a password input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    const input = sut.getByTestId('password')
    fireEvent.input(input, { target: { value: faker.internet.password() } })
    const status = sut.getByTestId('password-status')
    expect(status.title).toBe(validationError)
    expect(status.textContent).toBe('🔴')
  })

  test('Shold show valid email state when Validation has succeeds', () => {
    const { sut } = makeSut()
    const input = sut.getByTestId('email')
    fireEvent.input(input, { target: { value: faker.internet.email() } })
    const status = sut.getByTestId('email-status')
    expect(status.title).toBe('Tudo certo!')
    expect(status.textContent).toBe('🔵')
  })

  test('Shold show valid password state when Validation has succeeds', () => {
    const { sut } = makeSut()
    const input = sut.getByTestId('password')
    fireEvent.input(input, { target: { value: faker.internet.password() } })
    const status = sut.getByTestId('password-status')
    expect(status.title).toBe('Tudo certo!')
    expect(status.textContent).toBe('🔵')
  })

  test('Shold enable submit button if form is valid', () => {
    const { sut } = makeSut()
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const submit = sut.getByTestId('submit') as HTMLButtonElement
    expect(submit.disabled).toBe(false)
  })

  test('Shold show spinner on submit', () => {
    const { sut } = makeSut()
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } })
    const submit = sut.getByTestId('submit')
    fireEvent.click(submit)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('Shold call Authrentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const fakeEmail = faker.internet.email()
    const fakePass = faker.internet.password()
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: fakeEmail } })
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: fakePass } })
    const submit = sut.getByTestId('submit')
    fireEvent.click(submit)
    expect(authenticationSpy.params).toEqual({
      email: fakeEmail,
      password: fakePass
    })
  })
})
