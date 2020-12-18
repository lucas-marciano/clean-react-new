export class InvalidFieldError extends Error {
  constructor () {
    super('O campo incorreto')
    this.name = 'InvalidFieldError'
  }
}
