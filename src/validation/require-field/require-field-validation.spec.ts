import RequireFieldValidation from '@/validation/require-field/require-field-validation'
import { RequireFieldError } from '@/validation/error'

describe('RequireFieldValidation', () => {
  test('Should have error if field is empty', () => {
    const sut = new RequireFieldValidation('email')
    const error = sut.validate('')
    expect(error).toEqual(new RequireFieldError())
  })
})
