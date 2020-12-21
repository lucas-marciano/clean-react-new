import { InvalideCredentialError } from '@/domain/errors'
import { InvalidFieldError } from '@/validation/error'
import FieldValitation from '@/validation/protocols/field-validation'

export class MinLengthValidation implements FieldValitation {
  constructor (readonly field: string, private readonly minLength: number) {}

  validate (value: string): Error {
    return value.length >= this.minLength ? null : new InvalidFieldError()
  }
}
