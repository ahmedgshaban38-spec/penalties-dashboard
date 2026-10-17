'use client'

import type { Penalty } from '@/lib/penalties'
import { Sparkles, TrendingDown, AlertTriangle } from 'lucide-react'

export function InsightsSection({ rows }: { rows: Penalty[] }) {
  const totalAmount = rows.reduce((sum, r) => sum + (r.amount || 0), 0)
  const rejectedCount = rows.filter(r => r.status === 'مرفوضة' || r.status === 'بدون صورة').length

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl">
          <Sparkles className="size-6" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">رؤى العمليات والتحليلات الذكية</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">مؤشرات أداء تلقائية لمساعدة الإدارة في اتخاذ القرار</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-xl mt-1">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">توصية مالية</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              إجمالي الغرامات المسجلة بلغ <span className="font-bold text-red-600 dark:text-red-400">{totalAmount.toLocaleString()} رس</span>. يُنصح بمراجعة الفروع الأكثر مخالفة لتقليل الخسائر التشغيلية.
            </p>
          </div>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl mt-1">
            <TrendingDown className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">موقف المطالبات المرفوضة</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              هناك <span className="font-bold text-amber-600 dark:text-amber-400">{rejectedCount} حالة</span> مرفوضة أو بدون صورة إثبات. تأكد من إرفاق صور واضحة لتفادي ضياع حقوق المطالبات.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}