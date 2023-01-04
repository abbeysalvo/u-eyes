import { Publisher } from './base-publisher'
import { ProjectCreatedEvent } from './project-created-event'
import { Subjects } from './subjects'

export class ProjectCreatedPublisher extends Publisher<ProjectCreatedEvent> {
  readonly subject = Subjects.ProjectCreated
}
