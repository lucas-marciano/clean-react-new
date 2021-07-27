import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
import { Helper } from '@/presentation/test'
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { ValidationStub, AuthenticationSpy, SaveAccessTokenMock } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { Login } from '@/presentation/pages'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}

type SutParam = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (params?: SutParam): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessTokenMock = new SaveAccessTokenMock()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  )
  return {
    sut,
    authenticationSpy,
    saveAccessTokenMock
  }
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField('email', sut, email)
  Helper.populateField('password', sut, password)
  const form = sut.getByTestId('login-form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

const testContentIsEqual = (sut: RenderResult, fieldName: string, content: string): void => {
  const el = sut.getByTestId(fieldName)
  expect(el.textContent).toBe(content)
}

describe('Login components', () => {
  afterEach(cleanup)

  test('Shold start with initial state of the inputs', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    Helper.testStatusInput(sut, 'email-status', validationError)
    Helper.testStatusInput(sut, 'password-status', validationError)
  })

  test('Shold start with initial state of the button', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.testButtonIsDisabled(sut, 'submit')
  })

  test('Shold not render the loading and error message when initialize the view', () => {
    const { sut } = makeSut()
    Helper.testChildCount(sut, 0, 'error-wrap')
  })

  test('Shold show message of error when a email input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField('email', sut)
    Helper.testStatusInput(sut, 'email-status', validationError)
  })

  test('Shold show message of error when a password input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField('password', sut)
    Helper.testStatusInput(sut, 'password-status', validationError)
  })

  test('Shold show valid email state when Validation has succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField('email', sut)
    Helper.testStatusInput(sut, 'email-status')
  })

  test('Shold show valid password state when Validation has succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField('password', sut)
    Helper.testStatusInput(sut, 'password-status')
  })

  test('Shold enable submit button if form is valid', () => {
    const { sut } = makeSut()
    Helper.populateField('email', sut)
    Helper.populateField('password', sut)
    Helper.testButtonIsDisabled(sut, 'submit', false)
  })

  test('Shold show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    Helper.testElementExists(sut, 'spinner')
  })

  test('Shold call Authrentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()
    await simulateValidSubmit(sut, email, password)
    expect(authenticationSpy.params).toEqual({ email,password })
  })

  test('Shold call Authrentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Shold not call Authrentication is form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    Helper.populateField('email', sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Shold present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    testContentIsEqual(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 1, 'error-wrap')
  })

  test('Shold call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut()
    await simulateValidSubmit(sut)
    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('Shold present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    testContentIsEqual(sut, 'main-error', error.message)
    Helper.testChildCount(sut, 1, 'error-wrap')
  })

  test('Shold go to signup page', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    const signup = sut.getByTestId('signup')
    fireEvent.click(signup)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
