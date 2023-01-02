import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@as-extensions/common'
import { Project } from '../models/project'

const router = express.Router()

router.put(
  '/api/projects/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Please provided a title'),
    body('title')
      .trim()
      .isLength({ min: 4, max: 60 })
      .withMessage('Titles must be between 4 and 60 characters'),
    body('description')
      .trim()
      .isLength({ min: 4, max: 200 })
      .withMessage('Descriptions must be between 4 and 200 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.id)

    if (!project) {
      throw new NotFoundError()
    }

    if (project.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    project.set({
      title: req.body.title,
      description: req.body.description,
    })

    await project.save()

    res.send(project)
  }
)

export { router as modifyProjectRouter }
