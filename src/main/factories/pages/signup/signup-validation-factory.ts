import { CompositeValidation, ValidationBuilder as Builder } from '@/validation/validators'

export const makeSignUpValidation = (): CompositeValidation => {
  return CompositeValidation.build([
    ...Builder.field('name').required().min(8).build(),
    ...Builder.field('email').required().email().build(),
    ...Builder.field('password').required().min(5).build(),
    ...Builder.field('passwordConfirmation').required().min(5).build()
  ])
}
