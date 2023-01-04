import { Message } from 'node-nats-streaming'
import { Listener } from './base-listener'
import { ProjectCreatedEvent } from './project-created-event'
import { Subjects } from './subjects'

export class ProjectCreatedListener extends Listener<ProjectCreatedEvent> {
  readonly subject = Subjects.ProjectCreated
  queueGroupName = 'pages-service'

  onMessage(data: ProjectCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data)

    msg.ack()
  }
}
