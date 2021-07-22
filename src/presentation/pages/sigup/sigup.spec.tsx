import React from 'react'
import faker from 'faker'
import { cleanup, render, RenderResult, fireEvent, waitFor } from '@testing-library/react'
import { Helper, ValidationStub } from '@/presentation/test'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { SigUp } from '@/presentation/pages'

type SutTypes = {
  sut: RenderResult
}

type SutParam = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/sigup'] })

const makeSut = (params?: SutParam): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const sut = render(
    <Router history={history}>
      <SigUp
        validation={validationStub}
      />
    </Router>
  )
  return {
    sut
  }
}

const simulateValidSubmit = async (sut: RenderResult, name = faker.name.findName(), email = faker.internet.email(), password = faker.internet.password()): Promise<void> => {
  Helper.populateField('name', sut, name)
  Helper.populateField('email', sut, email)
  Helper.populateField('password', sut, password)
  Helper.populateField('passwordConfirmation', sut, password)
  const form = sut.getByTestId('sigup-form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('SigUp Component', () => {
  afterEach(cleanup)

  test('Shold start with initial state of the inputs', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.testChildCount(sut, 0, 'error-wrap')
    Helper.testButtonIsDisabled(sut, 'submit')
    Helper.testStatusInput(sut, 'name-status', validationError)
    Helper.testStatusInput(sut, 'email-status', validationError)
    Helper.testStatusInput(sut, 'password-status', validationError)
    Helper.testStatusInput(sut, 'passwordConfirmation-status', validationError)
  })

  test('Shold enable submit button if form is valid', () => {
    const { sut } = makeSut()
    Helper.populateField('name', sut)
    Helper.populateField('email', sut)
    Helper.populateField('password', sut)
    Helper.populateField('passwordConfirmation', sut)
    Helper.testButtonIsDisabled(sut, 'submit', false)
  })

  test('Shold show valid name state when Validation has succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField('name', sut)
    Helper.testStatusInput(sut, 'name-status')
  })

  test('Shold show message of error when a name input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField('name', sut)
    Helper.testStatusInput(sut, 'name-status', validationError)
  })

  test('Shold show valid email state when Validation has succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField('email', sut)
    Helper.testStatusInput(sut, 'email-status')
  })

  test('Shold show message of error when a email input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField('email', sut)
    Helper.testStatusInput(sut, 'email-status', validationError)
  })

  test('Shold show valid password state when Validation has succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField('password', sut)
    Helper.testStatusInput(sut, 'password-status')
  })

  test('Shold show message of error when a password input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField('password', sut)
    Helper.testStatusInput(sut, 'password-status', validationError)
  })

  test('Shold show valid passwordConfirmation state when Validation has succeeds', () => {
    const { sut } = makeSut()
    Helper.populateField('passwordConfirmation', sut)
    Helper.testStatusInput(sut, 'passwordConfirmation-status')
  })

  test('Shold show message of error when a passwordConfirmation input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField('passwordConfirmation', sut)
    Helper.testStatusInput(sut, 'passwordConfirmation-status', validationError)
  })

  test('Shold show spinner on submit', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    Helper.testElementExists(sut, 'spinner')
  })
})
