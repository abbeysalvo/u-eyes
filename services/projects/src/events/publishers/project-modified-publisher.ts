import {
  Publisher,
  Subjects,
  ProjectModifiedEvent,
} from '@as-extensions/common'

export class ProjectModifiedPublisher extends Publisher<ProjectModifiedEvent> {
  readonly subject = Subjects.ProjectModified
}
