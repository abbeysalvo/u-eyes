import { Publisher, Subjects, ProjectCreatedEvent } from '@as-extensions/common'

export class ProjectCreatedPublisher extends Publisher<ProjectCreatedEvent> {
  readonly subject = Subjects.ProjectCreated
}
