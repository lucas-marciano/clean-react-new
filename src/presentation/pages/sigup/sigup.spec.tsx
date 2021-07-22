import React from 'react'
import faker from 'faker'
import { cleanup, render, RenderResult } from '@testing-library/react'
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

describe('SigUp Component', () => {
  afterEach(cleanup)

  test('Shold start with initial state of the inputs', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.testChildCount(sut, 0, 'error-wrap')
    Helper.testButtonIsDisabled(sut, 'submit')
    Helper.testStatusInput(sut, 'name-status', validationError)
    Helper.testStatusInput(sut, 'email-status', 'Campo obrigatório')
    Helper.testStatusInput(sut, 'password-status', 'Campo obrigatório')
    Helper.testStatusInput(sut, 'passwordConfirmation-status', 'Campo obrigatório')
  })

  test('Shold show message of error when a name input filled wrong', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField('name', sut)
    Helper.testStatusInput(sut, 'name-status', validationError)
  })
})
