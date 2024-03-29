import { RequireFieldValidation } from '@/validation/validators'
import { RequireFieldError } from '@/validation/error'
import faker from 'faker'

const makeSut = (field: string): RequireFieldValidation => new RequireFieldValidation(field)

describe('RequireFieldValidation', () => {
  test('Should have error if field is empty', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: '' })
    expect(error).toEqual(new RequireFieldError())
  })

  test('Should return falsy if field is not empty', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toBeFalsy()
  })
})
