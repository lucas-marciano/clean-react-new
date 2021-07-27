import { InvalidFieldError } from '@/validation/error'
import FieldValitation from '@/validation/protocols/field-validation'

export class MinLengthValidation implements FieldValitation {
  constructor (readonly field: string, private readonly minLength: number) {}

  validate (input: object): Error {
    return input[this.field]?.length < this.minLength ? new InvalidFieldError() : null
  }
}
