import express, { Request, Response } from 'express'
import { NotFoundError } from '@as-extensions/common'
import { Project } from '../models/project'

const router = express.Router()

router.get('/api/projects', async (req: Request, res: Response) => {
  const project = await Project.find({})

  if (!project) {
    throw new NotFoundError()
  }

  res.send(project)
})

export { router as retrieveAllProjectsRouter }
