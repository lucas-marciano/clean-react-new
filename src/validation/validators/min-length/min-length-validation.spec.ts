import { InvalidFieldError } from '@/validation/error'
import { MinLengthValidation } from './min-length-validation'
import faker from 'faker'

type SutTypes = {
  sut: MinLengthValidation
}

const makeSut = (): SutTypes => {
  const sut = new MinLengthValidation(faker.database.column(), 5)
  return {
    sut
  }
}

describe('MinLengthValidation', () => {
  test('should return error if value is invalid', () => {
    const { sut } = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(3))
    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if value is valid', () => {
    const { sut } = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(5))
    expect(error).toBeFalsy()
  })
})
