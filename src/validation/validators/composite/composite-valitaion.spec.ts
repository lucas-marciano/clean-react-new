import { FieldValidationSpy } from '../test/mock-field-validation'
import { CompositeValidation } from './composite-valitaion'

type SutTypes = {
  sut: CompositeValidation
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy('any_field'),
    new FieldValidationSpy('any_field')
  ]
  const sut = new CompositeValidation(fieldValidationsSpy)
  return {
    sut,
    fieldValidationsSpy
  }
}

describe('CompositeValidation', () => {
  test('should return error if any validation fails', () => {
    const { sut, fieldValidationsSpy } = makeSut()
    fieldValidationsSpy[0].error = new Error('first_error_message')
    fieldValidationsSpy[1].error = new Error('second_error_message')
    const error = sut.validate('any_field', 'any_value')
    expect(error).toBe('first_error_message')
  })
})
