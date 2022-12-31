import express, { Request, Response } from 'express'
import { User } from '../models/user'
import { body } from 'express-validator'
import { validateRequest } from '../middlewares/validate-request'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../errors/bad-request-error'

const router = express.Router()

router.post(
  '/api/users/sign-up',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Check if a user with requested email already exists
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError(`The email ${email} is already in use`)
    }

    const user = User.build({ email, password })
    await user.save()

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    )

    // Store it on the session object
    req.session = { jwt: userJwt }

    res.status(201).send(user)
  }
)

export { router as signUpRouter }
