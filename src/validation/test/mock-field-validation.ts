import FieldValitation from '@/validation/protocols/field-validation'

export class FieldValidationSpy implements FieldValitation {
  error: Error = null
  constructor (readonly field: string) { }
  validate (input: object): Error {
    return this.error
  }
}
