import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Styles from './sigup-styles.scss'
import { Footer, FormStatus, Input, LoginHeader } from '@/presentation/components/'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount, SaveAccessToken } from '@/domain/usecases'

type Props = {
  validation: Validation
  addAccount: AddAccount
  saveAccessToken: SaveAccessToken
}

const SigUp: React.FC<Props> = ({ validation, addAccount, saveAccessToken }: Props) => {
  const history = useHistory()
  const [state, setState] = useState({
    isLoading: false,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: 'Campo obrigatório',
    mainError: ''
  })

  const hanldeSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading ||
      state.nameError ||
      state.emailError ||
      state.passwordError ||
      state.passwordConfirmationError) { return }

      setState({ ...state, isLoading: true })
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })
      await saveAccessToken.save(account.accessToken)
      history.replace('/')
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message
      })
    }
  }

  useEffect(() => {
    setState({
      ...state,
      nameError: validation.validate('name', state.name),
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password),
      passwordConfirmationError: validation.validate('passwordConfirmation', state.passwordConfirmation)
    })
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  return (
    <div className={Styles.sigup}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form data-testid="sigup-form" className={Styles.form} onSubmit={hanldeSubmit}>
          <h2>Cadastre sua conta</h2>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <Input type="password" name="passwordConfirmation" placeholder="Repita a senha" />
          <button data-testid="submit" disabled={
            !!state.nameError ||
            !!state.emailError ||
            !!state.passwordConfirmationError ||
            !!state.passwordError
          } className={Styles.submit} type="submit">Criar</button>
          <Link data-testid="login-link" replace to="/login" className={Styles.link}>Voltar para o Login</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default SigUp
