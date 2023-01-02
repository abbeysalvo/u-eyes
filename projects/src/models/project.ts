import mongoose from 'mongoose'

// An interface that describes the properties
// that are required to create a new Project
interface ProjectAttrs {
  title: string
  description: string
  userId: string
}

// An interface that describes the properties that a
// Project Model has (representing the entire collection of records)
interface ProjectModel extends mongoose.Model<ProjectDoc> {
  build(attrs: ProjectAttrs): ProjectDoc
}

// An interface that describes the properties
// that a Project Document has (representing a single record)
// This is where we add extra properties added by mongoose
interface ProjectDoc extends mongoose.Document {
  title: string
  description: string
  userId: string
}

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        // Modify specific data from response
        ret.id = ret._id
        // Remove specific data from response
        delete ret._id
        delete ret.__v
        // Add specific data to response
        // ret.admin = false
      },
    },
  }
)

// Allow typescript to validate/type-check the
// properties we were typing to use to make a new record.
projectSchema.statics.build = (attrs: ProjectAttrs) => {
  return new Project(attrs)
}

// Create the model
const Project = mongoose.model<ProjectDoc, ProjectModel>(
  'Project',
  projectSchema
)

// Export the model
export { Project }
