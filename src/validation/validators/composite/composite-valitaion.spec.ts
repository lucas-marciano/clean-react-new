import { FieldValidationSpy } from '@/validation/test/mock-field-validation'
import { CompositeValidation } from './composite-valitaion'
import faker from 'faker'

type SutTypes = {
  sut: CompositeValidation
  fieldValidationsSpy: FieldValidationSpy[]
}

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName)
  ]
  const sut = CompositeValidation.build(fieldValidationsSpy)
  return {
    sut,
    fieldValidationsSpy
  }
}

describe('CompositeValidation', () => {
  test('should return error if any validation fails', () => {
    const fieldName = faker.database.column()
    const { sut, fieldValidationsSpy } = makeSut(fieldName)
    const errorMock = faker.random.words()
    fieldValidationsSpy[0].error = new Error(errorMock)
    fieldValidationsSpy[1].error = new Error(faker.random.words())
    const error = sut.validate(fieldName, { [fieldName]: faker.random.word() })
    expect(error).toBe(errorMock)
  })

  test('should return falsy if any validation have not fails', () => {
    const fieldName = faker.database.column()
    const { sut } = makeSut(fieldName)
    const error = sut.validate(fieldName, { [fieldName]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
