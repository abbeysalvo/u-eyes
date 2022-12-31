import request from 'supertest'
import { app } from '../../app'
import {
  emailForTesting,
  successfulCurrentUser,
  successfulSignIn,
  successfulSignOut,
  successfulSignUp,
} from './_test-helpers'

it('responds with details about the current user', async () => {
  const signUpResonse = await successfulSignUp()
  const cookie = signUpResonse.get('Set-Cookie')
  await successfulSignIn()
  const response = await successfulCurrentUser(cookie)
  expect(response.body.currentUser.email).toEqual(emailForTesting)
})

it('responds with null when no user is signed in', async () => {
  const response = await successfulCurrentUser([])
  expect(response.body.currentUser).toEqual(null)
})
