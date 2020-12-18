import RequireFieldValidation from '@/validation/require-field/require-field-validation'
import { RequireFieldError } from '@/validation/error'
import faker from 'faker'

describe('RequireFieldValidation', () => {
  test('Should have error if field is empty', () => {
    const sut = new RequireFieldValidation('email')
    const error = sut.validate('')
    expect(error).toEqual(new RequireFieldError())
  })

  test('Should return falsy if field is not empty', () => {
    const sut = new RequireFieldValidation('email')
    const error = sut.validate(faker.random.word())
    expect(error).toBeFalsy()
  })
})
