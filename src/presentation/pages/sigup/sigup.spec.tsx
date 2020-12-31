import React from 'react'
import { cleanup, render, RenderResult } from '@testing-library/react'
import { testButtonIsDisabled, testChildCount, testStatusInput } from '@/presentation/test'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { SigUp } from '@/presentation/pages'

type SutTypes = {
  sut: RenderResult
}

const history = createMemoryHistory({ initialEntries: ['/sigup'] })

const makeSut = (): SutTypes => {
  const sut = render(
    <Router history={history}>
      <SigUp />
    </Router>
  )
  return {
    sut
  }
}

describe('SigUp Component', () => {
  afterEach(cleanup)

  test('Shold start with initial state of the inputs', () => {
    const { sut } = makeSut()
    const validationError = 'Campo obrigatório'
    testChildCount(sut, 0, 'error-wrap')
    testButtonIsDisabled(sut, 'submit')
    testStatusInput(sut, 'name-status', validationError)
    testStatusInput(sut, 'email-status', validationError)
    testStatusInput(sut, 'password-status', validationError)
    testStatusInput(sut, 'passwordConfirmation-status', validationError)
  })
})
