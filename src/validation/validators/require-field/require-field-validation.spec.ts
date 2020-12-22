import { RequireFieldValidation } from '@/validation/validators'
import { RequireFieldError } from '@/validation/error'
import faker from 'faker'

type SutTypes = {
  sut: RequireFieldValidation
  error: Error
}

type SutParam = {
  field: string
  value: string
}

const makeSut = (params: SutParam): SutTypes => {
  const sut = new RequireFieldValidation(params.field)
  const error = sut.validate(params.value)
  return {
    sut,
    error
  }
}

describe('RequireFieldValidation', () => {
  test('Should have error if field is empty', () => {
    const { error } = makeSut({ field: 'email', value: '' })
    expect(error).toEqual(new RequireFieldError())
  })

  test('Should return falsy if field is not empty', () => {
    const { error } = makeSut({ field: 'email', value: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
