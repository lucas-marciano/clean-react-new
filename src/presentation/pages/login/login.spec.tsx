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

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const input = sut.getByTestId('email')
  fireEvent.input(input, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const input = sut.getByTestId('password')
  fireEvent.input(input, { target: { value: password } })
}

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const submit = sut.getByTestId('submit')
  fireEvent.click(submit)
}

const simulateStatusInput = (sut: RenderResult, id: string, messageError?: string): void => {
  const status = sut.getByTestId(id)
  expect(status.title).toBe(messageError || 'Tudo certo!')
  expect(status.textContent).toBe(messageError ? '🔴' : '🔵')
}

describe('Login components', () => {
  afterEach(cleanup)
  test('Shold start with initial state of the inputs', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    simulateStatusInput(sut, 'email-status', validationError)
    simulateStatusInput(sut, 'password-status', validationError)
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
    populateEmailField(sut)
    simulateStatusInput(sut, 'email-status', validationError)
  })

  test('Shold show message of error when a password input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populatePasswordField(sut)
    simulateStatusInput(sut, 'password-status', validationError)
  })

  test('Shold show valid email state when Validation has succeeds', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    simulateStatusInput(sut, 'email-status')
  })

  test('Shold show valid password state when Validation has succeeds', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    simulateStatusInput(sut, 'password-status')
  })

  test('Shold enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    const submit = sut.getByTestId('submit') as HTMLButtonElement
    expect(submit.disabled).toBe(false)
  })

  test('Shold show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('Shold call Authrentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const pass = faker.internet.password()
    simulateValidSubmit(sut, email, pass)
    expect(authenticationSpy.params).toEqual({
      email: email,
      password: pass
    })
  })

  test('Shold call Authrentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Shold not call Authrentication is form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    populateEmailField(sut)
    fireEvent.submit(sut.getByTestId('login-form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })
})
