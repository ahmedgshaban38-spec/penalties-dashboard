import type { Penalty } from '@/lib/penalties'

export function AppSummary({ rows }: { rows: Penalty[] }) {
  const appStats: Record<string, { count: number; amount: number }> = {}
  
  rows.forEach(r => {
    const app = r.app || 'أخرى'
    if (!appStats[app]) appStats[app] = { count: 0, amount: 0 }
    appStats[app].count += 1
    appStats[app].amount += r.amount || 0
  })

  return (
    <div className="bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-2xl transition-all">
      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <span className="size-2 rounded-full bg-blue-500"></span>
        ملخص أعلى التطبيقات
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {Object.entries(appStats).length === 0 ? (
          <p className="text-sm text-slate-400">لا توجد بيانات متاحة</p>
        ) : (
          Object.entries(appStats).map(([app, data], i) => (
            <div key={i} className="bg-slate-50 dark:bg-[#060913] p-6 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col gap-3 hover:border-blue-500/50 hover:shadow-lg transition-all group">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{app}</span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{data.amount.toLocaleString()} <span className="text-xs font-normal text-slate-400">رس</span></p>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg w-fit">{data.count} مخالفة مسجلة</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}