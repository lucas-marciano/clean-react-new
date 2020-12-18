import FieldValitation from '@/validation/protocols/field-validation'
import { RequireFieldError } from '@/validation/error'

export default class RequireFieldValidation implements FieldValitation {
  constructor (readonly field: string) {}

  validate (value: string): Error {
    return value ? null : new RequireFieldError()
  }
}
