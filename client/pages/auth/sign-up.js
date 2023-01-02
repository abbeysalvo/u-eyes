import { useEffect, useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const SignUp = () => {
  // State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Hooks
  const { doRequest, errors } = useRequest({
    url: '/api/users/sign-up',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  })

  useEffect(() => {
    console.log('errors', errors)
  }, [errors])

  const onSubmit = async (event) => {
    event.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address:</label>
        <input
          className="form-control"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
        />
      </div>
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <h4>Oooops...</h4>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}

export default SignUp
