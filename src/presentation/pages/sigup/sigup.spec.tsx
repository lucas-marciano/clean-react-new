import React from 'react'
import faker from 'faker'
import { cleanup, render, RenderResult } from '@testing-library/react'
import { populateField, testButtonIsDisabled, testChildCount, testStatusInput, ValidationStub } from '@/presentation/test'
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

describe('SigUp Component', () => {
  afterEach(cleanup)

  test('Shold start with initial state of the inputs', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    testChildCount(sut, 0, 'error-wrap')
    testButtonIsDisabled(sut, 'submit')
    testStatusInput(sut, 'name-status', validationError)
    testStatusInput(sut, 'email-status', 'Campo obrigatório')
    testStatusInput(sut, 'password-status', 'Campo obrigatório')
    testStatusInput(sut, 'passwordConfirmation-status', 'Campo obrigatório')
  })

  test('Shold show message of error when a name input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    populateField('name', sut)
    testStatusInput(sut, 'name-status', validationError)
  })
})
