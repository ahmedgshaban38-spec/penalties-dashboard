import type { Penalty, PenaltyStatus } from './penalties'

const currency = new Intl.NumberFormat('ar-SA-u-nu-latn', { maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('ar-SA-u-nu-latn', { maximumFractionDigits: 2 })
const dateFmt = new Intl.DateTimeFormat('ar-SA-u-nu-latn-ca-gregory', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

export const formatSAR = (n: number) => `${currency.format(n)} ر.س`
export const formatAmount = (n: number) => `${decimal.format(n)} ر.س`
export const formatNumber = (n: number) => currency.format(n)
export const formatDate = (iso: string) => dateFmt.format(new Date(iso))
export const formatPct = (n: number) => `${decimal.format(Math.round(n * 10) / 10)}%`

const sum = (rows: Penalty[]) => rows.reduce((acc, r) => acc + r.amount, 0)

function groupBy(rows: Penalty[], key: (r: Penalty) => string) {
  const map = new Map<string, Penalty[]>()
  for (const r of rows) {
    const k = key(r)
    const list = map.get(k)
    if (list) list.push(r)
    else map.set(k, [r])
  }
  return map
}

export function getKpis(rows: Penalty[]) {
  const byStatus = (s: PenaltyStatus) => rows.filter((r) => r.status === s)
  const make = (list: Penalty[]) => ({ amount: sum(list), count: list.length })
  const total = make(rows)
  return {
    total,
    recovered: make(byStatus('recovered')),
    pending: make(byStatus('pending')),
    rejected: make(byStatus('rejected')),
  }
}

export function getByApp(rows: Penalty[]) {
  return [...groupBy(rows, (r) => r.app)]
    .map(([app, list]) => ({
      app,
      total: sum(list),
      count: list.length,
      recovered: sum(list.filter((r) => r.status === 'recovered')),
      pending: sum(list.filter((r) => r.status === 'pending')),
      rejected: sum(list.filter((r) => r.status === 'rejected')),
    }))
    .sort((a, b) => b.total - a.total)
}

export function getByReason(rows: Penalty[], limit = 6) {
  const total = sum(rows) || 1
  return [...groupBy(rows, (r) => r.reason)]
    .map(([reason, list]) => ({ reason, total: sum(list), count: list.length, share: (sum(list) / total) * 100 }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
}

export function getByBranch(rows: Penalty[]) {
  return [...groupBy(rows, (r) => r.branch)]
    .map(([branch, list]) => ({ branch, total: sum(list), count: list.length }))
    .sort((a, b) => b.total - a.total)
}

export function getAppTrends(rows: Penalty[], apps: string[], weeks = 8) {
  const latest = rows.reduce((max, r) => Math.max(max, new Date(r.date).getTime()), 0)
  const week = 7 * 86_400_000
  return apps.map((app) => {
    const buckets = Array.from({ length: weeks }, (_, i) => ({ week: i, value: 0 }))
    const list = rows.filter((r) => r.app === app)
    for (const r of list) {
      const idx = weeks - 1 - Math.floor((latest - new Date(r.date).getTime()) / week)
      if (idx >= 0 && idx < weeks) buckets[idx].value += r.amount
    }
    const half = weeks / 2
    const recent = buckets.slice(half).reduce((a, b) => a + b.value, 0)
    const previous = buckets.slice(0, half).reduce((a, b) => a + b.value, 0)
    const change = previous > 0 ? ((recent - previous) / previous) * 100 : 0
    return { app, total: sum(list), count: list.length, trend: buckets, change }
  })
}

export function buildInsight(rows: Penalty[]) {
  if (rows.length === 0) return 'لا توجد بيانات كافية لإنشاء ملاحظة تحليلية للفترة المحددة.'
  const kpis = getKpis(rows)
  const topApp = getByApp(rows)[0]
  const topReason = getByReason(rows, 1)[0]
  const recoveryRate = (kpis.recovered.amount / (kpis.total.amount || 1)) * 100
  const appShare = (topApp.total / (kpis.total.amount || 1)) * 100

  const parts = [
    `يستحوذ تطبيق ${topApp.app} على ${formatPct(appShare)} من إجمالي قيمة الغرامات.`,
    `السبب الأكثر تأثيراً هو "${topReason.reason}" بنسبة ${formatPct(topReason.share)} من القيمة.`,
    `نسبة الاسترداد الحالية ${formatPct(recoveryRate)}، مع ${formatNumber(kpis.pending.count)} مطالبة قيد المراجعة بقيمة ${formatSAR(kpis.pending.amount)}.`,
  ]
  parts.push(
    recoveryRate < 50
      ? 'يوصى بمتابعة المطالبات المعلقة وتوثيق الأدلة (صور التغليف وأوقات التجهيز) لرفع نسبة الاسترداد.'
      : 'أداء الاسترداد جيد، ويوصى بالتركيز على معالجة السبب الأكثر تكراراً لتقليل الغرامات من المصدر.',
  )
  return parts.join(' ')
}
