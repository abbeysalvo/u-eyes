import request from 'supertest'
import { app } from '../../app'
import {
  requestWithCookie,
  returnMongoID,
  validDescForTesting,
  validTitleForTesting,
} from './_test-helpers'

it('returns a 404 if requested project is not found', async () => {
  await request(app).get(`/api/projects/${returnMongoID}`).send().expect(404)
})

it('returns the project if requested project is found', async () => {
  const response = await requestWithCookie()
    .send({
      title: validTitleForTesting,
      description: validDescForTesting,
    })
    .expect(201)

  const projectResponse = await request(app)
    .get(`/api/projects/${response.body.id}`)
    .send()
    .expect(200)

  expect(projectResponse.body.title).toEqual(validTitleForTesting)
  expect(projectResponse.body.description).toEqual(validDescForTesting)
})
