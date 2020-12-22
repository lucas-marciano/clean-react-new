import { CompositeValidation } from '@/validation/validators'
import { ValidationBuilder } from '@/validation/validators'
import { makeValidation } from './login-validation-factory'

describe('LoginValidationFactory', () => {
  test('Should make CompositeValidation with correct validations', () => {
    const composite = makeValidation()
    expect(composite).toEqual(CompositeValidation.build([
      ...ValidationBuilder.field('email').required().email().build(),
      ...ValidationBuilder.field('password').required().min(5).build()
    ]))
  })
})
