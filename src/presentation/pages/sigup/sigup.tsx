import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Styles from './sigup-styles.scss'
import { Footer, FormStatus, Input, LoginHeader } from '@/presentation/components/'
import Context from '@/presentation/contexts/form/form-context'

const SigUp: React.FC = () => {
  const [state] = useState({
    isLoading: false,
    nameError: 'Campo obrigatório',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    passwordConfirmationError: 'Campo obrigatório',
    mainError: ''
  })

  return (
    <div className={Styles.sigup}>
      <LoginHeader />
      <Context.Provider value={{ state }}>
        <form className={Styles.form}>
          <h2>Cadastre sua conta</h2>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <Input type="password" name="passwordConfirmation" placeholder="Repita a senha" />
          <button data-testid="submit" disabled className={Styles.submit} type="submit">Criar</button>
          <Link to="/login" className={Styles.link}>Voltar para o Login</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default SigUp
