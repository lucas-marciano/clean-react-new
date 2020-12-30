import React from 'react'
import { makeRemoteAuth } from '@/main/factories/usecases/authentication/remote-authentication-factory'
import { makeValidation } from './login-validation-factory'
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/save-access-token/local-access-token-factory'
import { Login } from '@/presentation/pages'

export const makeLogin: React.FC = () => {
  return (
    <Login
      authentication={makeRemoteAuth()}
      validation={makeValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  )
}
