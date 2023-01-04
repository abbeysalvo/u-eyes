import request from 'supertest'
import { app } from '../../app'
import { createProject } from './_test-helpers'

it('returns an empty array if no projects are found', async () => {
  const response = await request(app).get('/api/projects').send().expect(200)
  expect(response.body.length).toEqual(0)
})

it('returns an array of projects if they exist', async () => {
  await createProject()
  await createProject()
  await createProject()

  const response = await request(app).get('/api/projects').send().expect(200)
  expect(response.body.length).toEqual(3)
})
