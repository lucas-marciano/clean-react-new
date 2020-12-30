import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
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

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const input = sut.getByTestId('email')
  fireEvent.input(input, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const input = sut.getByTestId('password')
  fireEvent.input(input, { target: { value: password } })
}

const simulateValidSubmit = async (sut: RenderResult, email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const form = sut.getByTestId('login-form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

const testStatusInput = (sut: RenderResult, id: string, messageError?: string): void => {
  const status = sut.getByTestId(id)
  expect(status.title).toBe(messageError || 'Tudo certo!')
  expect(status.textContent).toBe(messageError ? '🔴' : '🔵')
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}

const testElementExists = (sut: RenderResult, idTest: string): void => {
  const item = sut.getByTestId(idTest)
  expect(item).toBeTruthy()
}

const testContentIsEqual = (sut: RenderResult, fieldName: string, content: string): void => {
  const el = sut.getByTestId(fieldName)
  expect(el.textContent).toBe(content)
}

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled = true): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login components', () => {
  afterEach(cleanup)

  test('Shold start with initial state of the inputs', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    testStatusInput(sut, 'email-status', validationError)
    testStatusInput(sut, 'password-status', validationError)
  })

  test('Shold start with initial state of the button', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    testButtonIsDisabled(sut, 'submit')
  })

  test('Shold not render the loading and error message when initialize the view', () => {
    const { sut } = makeSut()
    testErrorWrapChildCount(sut, 0)
  })

  test('Shold show message of error when a email input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populateEmailField(sut)
    testStatusInput(sut, 'email-status', validationError)
  })

  test('Shold show message of error when a password input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populatePasswordField(sut)
    testStatusInput(sut, 'password-status', validationError)
  })

  test('Shold show valid email state when Validation has succeeds', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    testStatusInput(sut, 'email-status')
  })

  test('Shold show valid password state when Validation has succeeds', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    testStatusInput(sut, 'password-status')
  })

  test('Shold enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    testButtonIsDisabled(sut, 'submit', false)
  })

  test('Shold show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    testElementExists(sut, 'spinner')
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
    populateEmailField(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Shold present error if Authrentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    testContentIsEqual(sut, 'main-error', error.message)
    testErrorWrapChildCount(sut, 1)
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
    testErrorWrapChildCount(sut, 1)
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
