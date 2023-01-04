import nats from 'node-nats-streaming'
import { ProjectCreatedPublisher } from './events/project-created-publisher'

console.clear()

const stan = nats.connect('u-eyes', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', async () => {
  console.log('Publisher connected to NATS')

  const publisher = new ProjectCreatedPublisher(stan)
  try {
    await publisher.publish({
      id: '123',
      title: 'Sample Title',
      description: 'Example description',
    })
  } catch (err) {
    console.error(err)
  }
})
