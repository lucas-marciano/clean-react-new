import { Validation } from '@/presentation/protocols/validation'
import FieldValitation from '@/validation/protocols/field-validation'

export class CompositeValidation implements Validation {
  constructor (private readonly validators: FieldValitation[]) {}
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
