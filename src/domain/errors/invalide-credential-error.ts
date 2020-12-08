export class InvalideCredentialError extends Error {
  constructor () {
    super('Credenciais inválidas')
    this.name = 'InvalideCredentialError'
  }
}
