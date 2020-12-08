import { HttpPostClient } from '@/data/protocols/http/http-post-client'
import { HttpStatusCode } from '@/data/protocols/http/http-response'
import { InvalideCredentialError } from '@/domain/errors/invalide-credential-error'
import { UnexpectedError } from '@/domain/errors/unexpected-error'
import { AuthenticationParams } from '@/domain/usecases/authentication'

export class RemoteAuthentication {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient
  ) { }

  async auth (params: AuthenticationParams): Promise<void> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: break
      case HttpStatusCode.unathorized: throw new InvalideCredentialError()
      default: throw new UnexpectedError()
    }
  }
}
