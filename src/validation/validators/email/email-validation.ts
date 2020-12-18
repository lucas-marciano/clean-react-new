import { InvalidFieldError } from '@/validation/error'
import FieldValitation from '@/validation/protocols/field-validation'

export default class EmailValidation implements FieldValitation {
  constructor (readonly field: string) { }
  validate (value: string): Error {
    return new InvalidFieldError(this.field)
  }
}
