import request from 'supertest'
import { app } from '../../app'
import { Project } from '../../models/project'
import {
  invalidDescForTesting,
  invalidTitleForTesting,
  requestWithCookie,
  validDescForTesting,
  validTitleForTesting,
} from './_test-helpers'

it('has a route handler listening to /api/projects for post requests', async () => {
  const response = await request(app).post('/api/projects').send({})
  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/projects').send({}).expect(401)
})

it('returns a success status if the user is signed in', async () => {
  const response = await requestWithCookie().send({})
  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {
  await requestWithCookie()
    .send({
      title: invalidTitleForTesting,
      description: validDescForTesting,
    })
    .expect(400)

  await requestWithCookie()
    .send({
      description: validDescForTesting,
    })
    .expect(400)
})

it('returns an error if an invalid description is provided', async () => {
  await requestWithCookie()
    .send({
      title: validTitleForTesting,
      description: invalidDescForTesting,
    })
    .expect(400)
})

it('creates a project with valid inputs', async () => {
  let projects = await Project.find({})
  expect(projects.length).toEqual(0)

  await requestWithCookie()
    .send({
      title: validTitleForTesting,
      description: validDescForTesting,
    })
    .expect(201)

  projects = await Project.find({})
  expect(projects.length).toEqual(1)
  expect(projects[0].title).toEqual(validTitleForTesting)
  expect(projects[0].description).toEqual(validDescForTesting)
})
