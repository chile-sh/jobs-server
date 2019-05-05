import * as Job from './Job'

export const resolvers = {
  Query: {
    jobs: () => Job.all()
  }
}
