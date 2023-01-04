import request from 'supertest'
import { app } from '../../app'
import { successfulSignUp } from './_test-helpers'

it('returns a 201 on successful sign up', async () => {
  return successfulSignUp()
})

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'testtest.com',
      password: 'password',
    })
    .expect(400)
})

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400)
})

it('returns a 400 with missing email and password', async () => {
  // No password
  await request(app)
    .post('/api/users/sign-up')
    .send({ email: 'test@test.com' })
    .expect(400)

  // No email
  await request(app)
    .post('/api/users/sign-up')
    .send({ password: 'password' })
    .expect(400)

  // No password and no email
  return request(app).post('/api/users/sign-up').send({}).expect(400)
})

it('disallows duplicate emails', async () => {
  await successfulSignUp()

  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})

it('sets a cookie after successful sign up', async () => {
  const response = await successfulSignUp()
  expect(response.get('Set-Cookie')).toBeDefined()
})
