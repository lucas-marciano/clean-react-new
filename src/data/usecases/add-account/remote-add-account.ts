import { HttpPostClient } from '@/data/protocols/http'
import { AccountModel } from '@/domain/models'
import { AddAccount, AddAccountParms } from '@/domain/usecases'

export class RemoteAddAccount implements AddAccount {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AddAccountParms, AccountModel>
  ) {}

  async add (params: AddAccountParms): Promise<AccountModel> {
    await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    return null
  }
}
