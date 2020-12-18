export class RequireFieldError extends Error {
  constructor () {
    super('Campo obrigatório')
    this.name = 'RequireFieldError'
  }
}
