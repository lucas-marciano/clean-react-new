import { Validation } from '@/presentation/protocols/validation'
import FieldValitation from '@/validation/protocols/field-validation'

export class CompositeValidation implements Validation {
  private constructor (private readonly validators: FieldValitation[]) {}

  static build (validators: FieldValitation[]): CompositeValidation {
    return new CompositeValidation(validators)
  }

  validate (filedName: string, fieldValue: string): string {
    const validators = this.validators.filter(v => v.field === filedName)
    for (const validator of validators) {
      const error = validator.validate(fieldValue)
      if (error) {
        return error.message
      }
    }
  }
}
