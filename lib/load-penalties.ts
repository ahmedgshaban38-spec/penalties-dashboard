import { createClient } from '@supabase/supabase-js'
import { generateSamplePenalties, normalizeStatus, type DataSource, type Penalty } from './penalties'

const DEFAULT_SUPABASE_URL = 'https://ohxfdtsluuoafalhtxqv.supabase.co'

type Row = Record<string, unknown>

function pick(row: Row, keys: string[]): unknown {
  for (const key of keys) {
    const value = row[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  const lowered = Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]))
  for (const key of keys) {
    const value = lowered[key.toLowerCase()]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return undefined
}

const ORDER_KEYS = ['order_number', 'orderNumber', 'order_no', 'order_id', 'رقم_الطلب']
const PENALTY_ID_KEYS = ['penalty_id', 'penaltyId', 'penalties_id']
const STATUS_KEYS = ['status', 'claim_status', 'state', 'الحالة']

function toPenalty(row: Row, claim: Row | undefined, index: number) {
  const rawDate = pick(row, ['date', 'penalty_date', 'order_date', 'created_at', 'التاريخ'])
  const parsed = rawDate ? new Date(String(rawDate)) : null
  const status = pick(claim ?? {}, STATUS_KEYS) ?? pick(row, STATUS_KEYS)
  return {
    id: String(pick(row, ['id', 'penalty_id']) ?? index),
    orderNumber: String(pick(row, ORDER_KEYS) ?? '—'),
    date: parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString() : new Date(0).toISOString(),
    branch: String(pick(row, ['branch', 'branch_name', 'restaurant', 'restaurant_name', 'الفرع']) ?? 'غير محدد'),
    app: String(pick(row, ['app', 'app_name', 'platform', 'delivery_app', 'التطبيق']) ?? 'غير محدد'),
    amount: Number(pick(row, ['amount', 'penalty_amount', 'value', 'fine', 'المبلغ']) ?? 0) || 0,
    refundedAmount: Number(pick(row, ['refunded_amount', 'refundedAmount']) ?? 0) || 0,
    reason: String(pick(row, ['reason', 'penalty_reason', 'description', 'السبب']) ?? 'غير محدد'),
    status: normalizeStatus(status),
    // الأسطر الجديدة لقراءة تفاصيل المطالبة
    rejectionReason: String(pick(claim ?? {}, ['rejection_reason', 'rejectionReason']) ?? ''),
    evidenceLink: String(pick(claim ?? {}, ['evidence_link', 'evidenceLink']) ?? ''),
  } as Penalty
}

const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: 'no-store', headers: { ...Object.fromEntries(new Headers(init?.headers).entries()), 'Cache-Control': 'no-cache' } })

function resolveConnection() {
  const dedicatedKey = process.env.PENALTIES_SUPABASE_KEY
  if (dedicatedKey) return { url: process.env.PENALTIES_SUPABASE_URL ?? DEFAULT_SUPABASE_URL, key: dedicatedKey }
  return {
    url: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? DEFAULT_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

export async function loadPenalties(): Promise<{ rows: Penalty[]; source: DataSource }> {
  const { url, key } = resolveConnection()
  if (!key) return { rows: generateSamplePenalties(), source: { kind: 'sample', message: 'Missing keys' } }

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: noStoreFetch } })
    const [penalties, claims] = await Promise.all([
      supabase.from('Penalties').select('*').limit(10000),
      supabase.from('Claims').select('*').limit(10000),
    ])
    if (penalties.error) throw new Error(penalties.error.message)

    const claimIndex = new Map<string, Row>()
    for (const claim of (claims.data ?? []) as Row[]) {
      const ref = pick(claim, PENALTY_ID_KEYS) ?? pick(claim, ORDER_KEYS)
      if (ref !== undefined) claimIndex.set(String(ref), claim)
    }

    const rows = ((penalties.data ?? []) as Row[])
      .map((row, i) => toPenalty(row, claimIndex.get(String(pick(row, ['id']))) ?? claimIndex.get(String(pick(row, ORDER_KEYS))), i))
      .sort((a, b) => b.date.localeCompare(a.date))

    return { rows, source: { kind: 'supabase' } }
  } catch (error) {
    return { rows: generateSamplePenalties(), source: { kind: 'sample', message: 'Error fetching data' } }
  }
}