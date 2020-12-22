import { CompositeValidation, ValidationBuilder as Builder } from '@/validation/validators'

export const makeValidation = (): CompositeValidation => {
  return CompositeValidation.build([
    ...Builder.field('email').required().email().build(),
    ...Builder.field('password').required().min(5).build()
  ])
}
