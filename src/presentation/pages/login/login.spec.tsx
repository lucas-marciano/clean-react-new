import React from 'react'
import { render } from '@testing-library/react'
import Login from './login'

describe('Login components', () => {
  test('Shold not show the loading and error message when initialize the view', () => {
    const { getByTestId } = render(<Login />)
    const errorWrap = getByTestId('error-wrap')

    expect(errorWrap.childElementCount).toBe(0)
  })
})
