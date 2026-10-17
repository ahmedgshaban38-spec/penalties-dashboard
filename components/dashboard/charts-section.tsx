'use client'

import { useMemo } from 'react'
import type { Penalty } from '@/lib/penalties'

export function ChartsSection({ rows }: { rows: Penalty[] }) {
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { 'قيد المراجعة': 0, 'تم الاسترداد': 0, 'مرفوضة': 0, 'بدون صورة': 0 }
    rows.forEach(r => {
      const s = r.status || 'قيد المراجعة'
      counts[s] = (counts[s] || 0) + 1
    })
    return counts
  }, [rows])

  const total = rows.length || 1
  const refundedCount = statusCounts['تم الاسترداد'] || 0
  const reviewCount = statusCounts['قيد المراجعة'] || 0
  const rejectedCount = (statusCounts['مرفوضة'] || 0) + (statusCounts['بدون صورة'] || 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* كارت حالات الغرامات */}
      <div className="bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-2xl transition-all">
        <div className="mb-6">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">حالات الغرامات</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">توزيع عدد الغرامات حسب الحالة التشغيلية</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4">
          <div className="relative size-44 rounded-full border-8 border-blue-500/20 dark:border-blue-500/30 flex items-center justify-center bg-blue-500/5 dark:bg-blue-500/10 shadow-inner">
            <div className="text-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{rows.length}</span>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">إجمالي الحالات</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex items-center justify-between gap-6 bg-slate-50 dark:bg-[#060913] px-4 py-3 rounded-xl border border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-emerald-500"></span><span className="text-sm font-bold text-slate-700 dark:text-slate-300">تم الاسترداد</span></div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{Math.round((refundedCount/total)*100)}% ({refundedCount})</span>
            </div>
            <div className="flex items-center justify-between gap-6 bg-slate-50 dark:bg-[#060913] px-4 py-3 rounded-xl border border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-amber-500"></span><span className="text-sm font-bold text-slate-700 dark:text-slate-300">قيد المراجعة</span></div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{Math.round((reviewCount/total)*100)}% ({reviewCount})</span>
            </div>
            <div className="flex items-center justify-between gap-6 bg-slate-50 dark:bg-[#060913] px-4 py-3 rounded-xl border border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2"><span className="size-3 rounded-full bg-red-500"></span><span className="text-sm font-bold text-slate-700 dark:text-slate-300">مرفوضة / بدون صورة</span></div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{Math.round((rejectedCount/total)*100)}% ({rejectedCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* كارت الغرامات حسب التطبيق */}
      <div className="bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-2xl transition-all">
        <div className="mb-6">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">الغرامات حسب التطبيق</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">قيمة الغرامات موزعة حسب منصة التوصيل</p>
        </div>

        <div className="space-y-4 py-2">
          {['هنقرستيشن', 'جاهز', 'تويو', 'ذا شيفز', 'نينجا'].map((appName, idx) => {
            const appRows = rows.filter(r => r.app === appName)
            const appTotal = appRows.reduce((sum, r) => sum + (r.amount || 0), 0)
            const maxVal = Math.max(...rows.map(r => r.amount || 0), 100)
            const percent = Math.min(Math.round((appTotal / (maxVal || 1)) * 100), 100)

            return (
              <div key={idx} className="space-y-2 bg-slate-50 dark:bg-[#060913] p-4 rounded-2xl border border-slate-100 dark:border-white/10">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-700 dark:text-slate-200">{appName}</span>
                  <span className="text-slate-900 dark:text-white font-mono">{appTotal.toLocaleString()} رس</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}