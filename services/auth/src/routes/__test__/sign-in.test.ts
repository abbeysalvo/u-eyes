import request from 'supertest'
import { app } from '../../app'
import {
  emailForTesting,
  passwordForTesting,
  successfulSignIn,
  successfulSignUp,
} from './_test-helpers'

it('returns a 400 on an email that does not exist', async () => {
  return request(app)
    .post('/api/users/sign-in')
    .send({
      email: emailForTesting,
      password: passwordForTesting,
    })
    .expect(400)
})

it('returns a 200 on successful sign in', async () => {
  await successfulSignUp()
  return successfulSignIn()
})

it('returns a 400 with an invalid email', async () => {
  await successfulSignUp()
  return request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'testtest.com',
      password: passwordForTesting,
    })
    .expect(400)
})

it('returns a 400 with an invalid password', async () => {
  await successfulSignUp()
  return request(app)
    .post('/api/users/sign-in')
    .send({
      email: emailForTesting,
      password: 'pass',
    })
    .expect(400)
})

it('responds with a cookie after valid credentials are provided', async () => {
  await successfulSignUp()
  const response = await successfulSignIn()
  expect(response.get('Set-Cookie')).toBeDefined()
})
