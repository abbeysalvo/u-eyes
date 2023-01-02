import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@as-extensions/common'
import { Project } from '../models/project'

const router = express.Router()

router.post(
  '/api/projects',
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
    const { title, description } = req.body
    const project = Project.build({
      title,
      description,
      userId: req.currentUser!.id,
    })

    await project.save()

    res.status(201).send(project)
  }
)

export { router as createProjectRouter }
