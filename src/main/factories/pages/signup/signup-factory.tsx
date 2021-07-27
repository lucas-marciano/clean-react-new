import React from 'react'
import { makeRemoteAuth } from '@/main/factories/usecases/authentication/remote-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeLocalSaveAccessToken } from '@/main/factories/usecases/save-access-token/local-access-token-factory'
import { Login } from '@/presentation/pages'

export const makeSignUp: React.FC = () => {
  return (
    <Login
      authentication={makeRemoteAuth()}
      validation={makeSignUpValidation()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  )
}
