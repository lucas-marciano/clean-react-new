import { Validation } from '@/presentation/protocols/validation'

export class ValidationSpy implements Validation {
  errorMessage: string
  filedName: string
  fieldValue: string
  validate (filedName: string, fieldValue: string): string {
    this.filedName = filedName
    this.fieldValue = fieldValue
    return this.errorMessage
  }
}
