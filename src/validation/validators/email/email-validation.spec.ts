import faker from 'faker'
import EmailValidation from './email-validation'
import { InvalidFieldError } from '@/validation/error'

type SutTypes = {
  sut: EmailValidation
}

const makeSut = (field: string): SutTypes => {
  const sut = new EmailValidation(field)
  return {
    sut
  }
}

describe('EmailValidation', () => {
  test('should return error if emails is invalid', () => {
    const { sut } = makeSut(faker.random.words())
    const error = sut.validate(faker.random.words())
    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return falsy if emails is valid', () => {
    const { sut } = makeSut(faker.random.words())
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
})
