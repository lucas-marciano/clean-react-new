import FieldValitation from '@/validation/protocols/field-validation'
import { InvalidFieldError } from '@/validation/error'

export class CompareFieldsValidation implements FieldValitation {
  constructor (readonly field: string, private readonly valueToCompare: string) {}

  validate (value: string): Error {
    return value !== this.valueToCompare ? new InvalidFieldError() : null
  }
}
