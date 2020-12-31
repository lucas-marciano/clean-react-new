import { RenderResult, fireEvent } from '@testing-library/react'
import faker from 'faker'

export const testChildCount = (sut: RenderResult, count: number, fieldName: string): void => {
  const el = sut.getByTestId(fieldName)
  expect(el.childElementCount).toBe(count)
}

export const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled = true): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

export const testStatusInput = (sut: RenderResult, id: string, messageError?: string): void => {
  const status = sut.getByTestId(id)
  expect(status.title).toBe(messageError || 'Tudo certo!')
  expect(status.textContent).toBe(messageError ? '🔴' : '🔵')
}

export const populateField = (iputId: string, sut: RenderResult, value = faker.random.word()): void => {
  const input = sut.getByTestId(iputId)
  fireEvent.input(input, { target: { value } })
}
