import db from '@common/lib/db'

export const all = async () => {
  const allJobs = await db.select('jobs')

  return allJobs
}
