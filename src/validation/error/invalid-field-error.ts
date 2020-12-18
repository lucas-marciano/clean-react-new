export class InvalidFieldError extends Error {
  constructor (readonly fieldName: string) {
    super(`O campo ${fieldName} está incorreto`)
    this.name = 'InvalidFieldError'
  }
}
