import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@as-extensions/common'
import { Project } from '../models/project'
import { ProjectCreatedPublisher } from '../events/publishers/project-created-publisher'
import { Stan } from 'node-nats-streaming'
import { natsWrapper } from '../nats-wrapper'

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

    // The getter, natsWrapper.client, will throw an error if
    // the system attempts to access the client prior to it being defined
    // or prior to connecting to NATS
    new ProjectCreatedPublisher(natsWrapper.client).publish({
      description: project.description,
      id: project.id,
      title: project.title,
      userId: project.userId,
    })

    res.status(201).send(project)
  }
)

export { router as createProjectRouter }
