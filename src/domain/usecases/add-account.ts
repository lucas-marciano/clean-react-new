import { AccountModel } from '@/domain/models'

export type AddAccountParms = {
  email: string
  name: string
  password: string
  passwordConfirmation: string
}

export interface AddAccount {
  add: (params: AddAccountParms) => Promise<AccountModel>
}
