import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { AddAccount, AddAccountParms, Authentication, AuthenticationParams } from '@/domain/usecases'

export class AddAccountSpy implements AddAccount {
  account = mockAccountModel()
  params: AddAccountParms
  callsCount = 0

  async add (params: AddAccountParms): Promise<AccountModel> {
    this.params = params
    this.callsCount++
    return this.account
  }
}
