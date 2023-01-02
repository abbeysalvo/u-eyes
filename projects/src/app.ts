/**
 * Configures the express application for
 * use in all environments as well as for testing
 */
import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@as-extensions/common'
import { createProjectRouter } from './routes/create-project'
import { retrieveProjectRouter } from './routes/retrieve-project'
import { retrieveAllProjectsRouter } from './routes/retrieve-all-projects'
import { modifyProjectRouter } from './routes/modify-project'

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
app.use(currentUser)
app.use(createProjectRouter)
app.use(retrieveProjectRouter)
app.use(retrieveAllProjectsRouter)
app.use(modifyProjectRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
