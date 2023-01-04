import request from 'supertest'
import { app } from '../../app'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export const returnMongoID = new mongoose.Types.ObjectId().toHexString()

export const emailForTesting = 'test@test.com'
export const randomIdForTesting = returnMongoID //'63b25e919547add740e1cd59'
export const validTitleForTesting = 'Example Project Title'
export const validDescForTesting = 'This is just an example'
export const invalidTitleForTesting = ''
export const invalidDescForTesting = ''

export const returnTestCookie = (id?: string) => {
  // Build a JWT payload { id, email }
  const payload = {
    email: emailForTesting,
    id: id ?? randomIdForTesting,
  }
  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  // Build session object { jwt: MY_JWT }
  const session = { jwt: token }
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)
  // Encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')
  // Return a string which is a cookie with encoded data
  return [`session=${base64}`]
}

export const requestWithCookie = (cookie?: string[]) => {
  return request(app)
    .post('/api/projects')
    .set('Cookie', cookie ?? returnTestCookie())
}

export const createProject = (cookie?: string[]) => {
  return requestWithCookie(cookie)
    .send({
      title: validTitleForTesting,
      description: validDescForTesting,
    })
    .expect(201)
}
