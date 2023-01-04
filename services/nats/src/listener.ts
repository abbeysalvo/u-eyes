import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { ProjectCreatedListener } from './events/project-created-listener'

console.clear()

const stan = nats.connect('u-eyes', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  new ProjectCreatedListener(stan).listen()
})

/**
 * Attempt to close gracefully
 * Upon close, emmit the close event
 */
process.on('SIGINT', () => stan.close())
process.on('SIGTERM', () => stan.close())
