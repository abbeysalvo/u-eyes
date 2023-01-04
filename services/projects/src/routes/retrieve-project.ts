import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@as-extensions/common'
import { Project } from '../models/project'

const router = express.Router()

router.get('/api/projects/:id', async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    throw new NotFoundError()
  }

  res.send(project)
})

export { router as retrieveProjectRouter }
