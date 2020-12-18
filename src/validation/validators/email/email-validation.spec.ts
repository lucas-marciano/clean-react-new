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
  test('should return email if emails is invalid', () => {
    const { sut } = makeSut('email')
    const error = sut.validate('')
    expect(error).toEqual(new InvalidFieldError('email'))
  })
})
