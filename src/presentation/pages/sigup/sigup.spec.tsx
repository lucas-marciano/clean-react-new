import React from 'react'
import { cleanup, render, RenderResult } from '@testing-library/react'
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

const testChildCount = (sut: RenderResult, count: number, fieldName: string): void => {
  const el = sut.getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled = true): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

const testStatusInput = (sut: RenderResult, id: string, messageError?: string): void => {
  const status = sut.getByTestId(id)
  expect(status.title).toBe(messageError || 'Tudo certo!')
  expect(status.textContent).toBe(messageError ? '🔴' : '🔵')
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
