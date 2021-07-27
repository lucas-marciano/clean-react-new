import { CompositeValidation } from '@/validation/validators'
import { ValidationBuilder as Builder } from '@/validation/validators'
import { makeSignUpValidation } from './signup-validation-factory'

describe('LoginValidationFactory', () => {
  test('Should make CompositeValidation with correct validations', () => {
    const composite = makeSignUpValidation()
    expect(composite).toEqual(CompositeValidation.build([
      ...Builder.field('name').required().min(8).build(),
      ...Builder.field('email').required().email().build(),
      ...Builder.field('password').required().min(5).build(),
      ...Builder.field('passwordConfirmation').required().min(5).build()
    ]))
  })
})
