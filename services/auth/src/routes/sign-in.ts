import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError, validateRequest } from '@as-extensions/common'
import { User } from '../models/user'
import { PasswordManager } from '../services/password-manager'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post(
  '/api/users/sign-in',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('A password must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials')
    }

    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    )
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials')
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    )

    // Store it on the session object
    req.session = { jwt: userJwt }

    res.status(200).send(existingUser)
  }
)

export { router as signInRouter }
