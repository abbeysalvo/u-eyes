import request from 'supertest'
import { app } from '../../app'

export const emailForTesting = 'test@test.com'
export const passwordForTesting = 'password'

export const successfulSignUp = () => {
  return request(app)
    .post('/api/users/sign-up')
    .send({
      email: emailForTesting,
      password: passwordForTesting,
    })
    .expect(201)
}

export const successfulSignIn = () => {
  return request(app)
    .post('/api/users/sign-in')
    .send({
      email: emailForTesting,
      password: passwordForTesting,
    })
    .expect(200)
}

export const successfulSignOut = () => {
  return request(app).post('/api/users/sign-out').expect(200)
}

export const successfulCurrentUser = (cookie: string[]) => {
  return request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200)
}
