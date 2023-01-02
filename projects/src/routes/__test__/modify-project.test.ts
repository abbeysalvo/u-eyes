import request from 'supertest'
import { app } from '../../app'
import { Project } from '../../models/project'
import {
  createProject,
  invalidDescForTesting,
  invalidTitleForTesting,
  requestWithCookie,
  returnMongoID,
  returnTestCookie,
  validDescForTesting,
  validTitleForTesting,
} from './_test-helpers'

it('returns 401 if user is not authenticated', async () => {
  await request(app)
    .put(`/api/projects/${returnMongoID}`)
    .send({ title: validTitleForTesting, description: validDescForTesting })
    .expect(401)
})

it('returns 404 if the provided id does not exist', async () => {
  await request(app)
    .put(`/api/projects/${returnMongoID}`)
    .set('Cookie', returnTestCookie())
    .send({ title: validTitleForTesting, description: validDescForTesting })
    .expect(404)
})

it('returns 401 if user does not own the project', async () => {
  const response = await createProject()
  await request(app)
    .put(`/api/projects/${response.body.id}`)
    .set('Cookie', returnTestCookie('doesnotexist'))
    .send({
      title: validTitleForTesting + ': Change Occured',
      description: validDescForTesting + ': Change Occured',
    })
    .expect(401)

  const projectResponse = await request(app)
    .get(`/api/projects/${response.body.id}`)
    .send()
    .expect(200)

  expect(projectResponse.body.title).toEqual(validTitleForTesting)
  expect(projectResponse.body.description).toEqual(validDescForTesting)
})

it('returns 400 if user provides an invalid title or description', async () => {
  const cookie = returnTestCookie()
  const response = await createProject(cookie)

  await request(app)
    .put(`/api/projects/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: invalidTitleForTesting,
      description: validDescForTesting + ': Change Occured',
    })
    .expect(400)

  await request(app)
    .put(`/api/projects/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: invalidTitleForTesting + ': Change Occured',
      description: invalidDescForTesting,
    })
    .expect(400)
})

it('updates the project with valid inputs', async () => {
  const cookie = returnTestCookie()
  const response = await createProject(cookie)

  expect(response.body.title).toEqual(validTitleForTesting)
  expect(response.body.description).toEqual(validDescForTesting)

  const projectResponse = await request(app)
    .put(`/api/projects/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: validTitleForTesting + ': Change Occured',
      description: validDescForTesting + ': Change Occured',
    })
    .expect(200)

  expect(projectResponse.body.title).toEqual(
    validTitleForTesting + ': Change Occured'
  )
  expect(projectResponse.body.description).toEqual(
    validDescForTesting + ': Change Occured'
  )
})
