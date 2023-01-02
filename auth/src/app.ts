/**
 * Configures the express application for
 * use in all environments as well as for testing
 */
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@as-extensions/common'

import { currentUserRouter } from './routes/current-user'
import { removeUserRouter } from './routes/remove-user'
import { signInRouter } from './routes/sign-in'
import { signOutRouter } from './routes/sign-out'
import { signUpRouter } from './routes/sign-up'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    // Set a cookie in the header of https requests
    // unless you are testing, in which case always send a cookie
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUserRouter)
app.use(removeUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
