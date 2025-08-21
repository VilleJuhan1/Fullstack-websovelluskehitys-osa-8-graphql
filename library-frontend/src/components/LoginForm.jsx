import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import propTypes from 'prop-types'
//import { set } from 'mongoose'

// 8.18 Kirjautuminen
const LoginForm = ( props ) => {
  const [username, setUsername] = useState('nerd666') // Oletuskäyttäjänimi testaukseen
  const [password, setPassword] = useState('qC4v1ysiwyYwupxI') // Oletussalasana testaukseen

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      console.log('Login result:', result.data)
      const token = result.data.login.token ? result.data.login.token : null
      const user = result.data.login.user ? result.data.login.user : null
      console.log('User:', user)
      console.log('Login successful, token:', token)
      props.setToken(token)
      props.setUser(user)
      props.setNotification('Login successful!')
      setTimeout(() => {
        props.setNotification(null)
      }, 5000)

      localStorage.setItem('library-app-token', token)
      localStorage.setItem('library-app-user', JSON.stringify(user))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data, username])

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  // LoginForm näytetään, jos tokenia ei ole (käyttäjä ei ole kirjautunut sisään)
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  setError: propTypes.func,
  setToken: propTypes.func,
  setUser: propTypes.func,
  setUsername: propTypes.func,
  setNotification: propTypes.func,
  show: propTypes.bool
}


export default LoginForm