import express from 'express'

const router = express.Router()

router.delete('/api/users/remove-user', (req, res) => {
  res.send('remove-user says, Hi there!')
})

export { router as removeUserRouter }
