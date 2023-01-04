import { Subjects } from './subjects'

export interface ProjectCreatedEvent {
  subject: Subjects.ProjectCreated
  data: {
    description: string
    id: string
    title: string
  }
}
