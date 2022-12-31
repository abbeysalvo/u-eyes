import request from 'supertest'
import { app } from '../../app'
import {
  successfulSignIn,
  successfulSignOut,
  successfulSignUp,
} from './_test-helpers'

it('returns a 200 on successful sign out', async () => {
  await successfulSignUp()
  await successfulSignIn()
  return successfulSignOut()
})

it('clears the cookie on sign out', async () => {
  await successfulSignUp()
  await successfulSignIn()
  const response = await successfulSignOut()
  expect(response.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  )
})
