import db from '../../lib/db'

export const all = async () => {
  const allJobs = await db.select('jobs')

  return allJobs
}
