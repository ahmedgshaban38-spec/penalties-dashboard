import { Dashboard } from '@/components/dashboard/dashboard'
import { loadPenalties } from '@/lib/load-penalties'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function Page() {
  const { rows, source } = await loadPenalties()
  return <Dashboard rows={rows} source={source} />
}
