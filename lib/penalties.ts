export type PenaltyStatus = 'recovered' | 'pending' | 'rejected'

export type Penalty = {
  id: string
  orderNumber: string
  date: string
  branch: string
  app: string
  amount: number
  reason: string
  status: PenaltyStatus
}

export type DataSource = {
  kind: 'supabase' | 'sample'
  message?: string
}

export const STATUS_LABELS: Record<PenaltyStatus, string> = {
  recovered: 'تم استردادها',
  pending: 'قيد المراجعة',
  rejected: 'مرفوضة',
}

export const STATUS_COLORS: Record<PenaltyStatus, string> = {
  recovered: 'var(--success)',
  pending: 'var(--warning)',
  rejected: 'var(--destructive)',
}

export const APP_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function normalizeStatus(value: unknown): PenaltyStatus {
  const s = String(value ?? '').trim().toLowerCase()
  if (/reject|denied|declin|lost|رفض|مرفوض/.test(s)) return 'rejected'
  if (/recover|refund|approv|accept|paid|won|resolved|استرد|مقبول|مسترد/.test(s)) return 'recovered'
  return 'pending'
}

function seeded(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function generateSamplePenalties(): Penalty[] {
  const rand = seeded(42)
  const branches = [
    'برجر هاوس - العليا',
    'برجر هاوس - النخيل',
    'برجر هاوس - الملقا',
    'شاورما بلس - الروضة',
    'شاورما بلس - السلامة',
    'بيتزا تاون - الحمراء',
  ]
  const branchWeights = [0.26, 0.14, 0.18, 0.12, 0.17, 0.13]
  const apps = ['هنقرستيشن', 'جاهز', 'مرسول', 'كيتا', 'ذا شفز']
  const appWeights = [0.34, 0.26, 0.16, 0.14, 0.1]
  const reasons = [
    'تأخر تجهيز الطلب',
    'صنف ناقص',
    'طلب خاطئ',
    'إلغاء من المطعم',
    'سوء التغليف',
    'جودة الطعام',
    'عدم توفر صنف',
  ]
  const reasonWeights = [0.3, 0.2, 0.15, 0.12, 0.09, 0.08, 0.06]
  const pickWeighted = (items: string[], weights: number[]) => {
    const r = rand()
    let acc = 0
    for (let i = 0; i < items.length; i++) {
      acc += weights[i]
      if (r <= acc) return items[i]
    }
    return items[items.length - 1]
  }

  const end = new Date('2026-10-17T12:00:00Z').getTime()
  const day = 86_400_000
  const rows: Penalty[] = []
  for (let i = 0; i < 320; i++) {
    const s = rand()
    const status: PenaltyStatus = s < 0.46 ? 'recovered' : s < 0.76 ? 'pending' : 'rejected'
    const daysAgo = Math.floor(Math.pow(rand(), 1.15) * 56)
    rows.push({
      id: `sample-${i}`,
      orderNumber: `ORD-${(108_400 + i * 7).toString()}`,
      date: new Date(end - daysAgo * day - Math.floor(rand() * day)).toISOString(),
      branch: pickWeighted(branches, branchWeights),
      app: pickWeighted(apps, appWeights),
      amount: Math.round((12 + rand() * 88) * 100) / 100,
      reason: pickWeighted(reasons, reasonWeights),
      status,
    })
  }
  return rows.sort((a, b) => b.date.localeCompare(a.date))
}
