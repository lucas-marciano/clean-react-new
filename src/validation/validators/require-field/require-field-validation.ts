import FieldValitation from '@/validation/protocols/field-validation'
import { RequireFieldError } from '@/validation/error'

export class RequireFieldValidation implements FieldValitation {
  constructor (readonly field: string) {}

  validate (input: object): Error {
    return input[this.field] ? null : new RequireFieldError()
  }
}
