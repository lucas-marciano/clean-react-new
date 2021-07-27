import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { SigUp } from '@/presentation/pages'

type Props = {
  makeLogin: React.FC
}

const Router: React.FC<Props> = ({ makeLogin }: Props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={makeLogin} />
        <Route path="/sigup" exact component={SigUp} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
