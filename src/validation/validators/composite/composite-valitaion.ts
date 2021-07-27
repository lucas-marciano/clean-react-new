import { Validation } from '@/presentation/protocols/validation'
import FieldValitation from '@/validation/protocols/field-validation'

export class CompositeValidation implements Validation {
  private constructor (private readonly validators: FieldValitation[]) {}

  static build (validators: FieldValitation[]): CompositeValidation {
    return new CompositeValidation(validators)
  }

  validate (filedName: string, input: object): string {
    const validators = this.validators.filter(v => v.field === filedName)
    for (const validator of validators) {
      const error = validator.validate(input)
      if (error) {
        return error.message
      }
    }
  }
}
