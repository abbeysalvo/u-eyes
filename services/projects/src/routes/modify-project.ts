import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@as-extensions/common'
import { Project } from '../models/project'
import { ProjectModifiedPublisher } from '../events/publishers/project-modified-publisher'
import { natsWrapper } from '../nats-wrapper'

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
    // Request incoming
    const project = await Project.findById(req.params.id)

    // Validation
    if (!project) {
      throw new NotFoundError()
    }

    if (project.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    // Modify the document
    project.set({
      title: req.body.title,
      description: req.body.description,
    })

    // Save the changes
    await project.save()

    // Publish an event
    // The getter, natsWrapper.client, will throw an error if
    // the system attempts to access the client prior to it being defined
    // or prior to connecting to NATS
    await new ProjectModifiedPublisher(natsWrapper.client).publish({
      description: project.description,
      id: project.id,
      title: project.title,
      userId: project.userId,
    })

    res.send(project)
  }
)

export { router as modifyProjectRouter }
