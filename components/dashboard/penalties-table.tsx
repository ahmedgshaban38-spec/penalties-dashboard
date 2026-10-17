'use client'

import { useState } from 'react'
import type { Penalty } from '@/lib/penalties'
import { Search, ExternalLink, AlertCircle } from 'lucide-react'

export function PenaltiesTable({ rows }: { rows: Penalty[] }) {
  const [search, setSearch] = useState('')

  const filteredRows = rows.filter(r => {
    const query = search.toLowerCase()
    const orderNo = String(r.orderNumber || '').toLowerCase()
    const branchName = String(r.branch || '').toLowerCase()
    const reasonText = String(r.reason || '').toLowerCase()
    const restaurant = String((r as any).restaurantName || '').toLowerCase()
    return orderNo.includes(query) || branchName.includes(query) || reasonText.includes(query) || restaurant.includes(query)
  })

  return (
    <div className="flex flex-col w-full">
      {/* شريط البحث النظيف */}
      <div className="p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="بحث برقم الطلب، الفرع، أو السبب..." 
            className="w-full h-12 pr-12 pl-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-900 dark:text-white"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
          إجمالي النتائج: {filteredRows.length}
        </span>
      </div>

      {/* جدول البيانات */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
              <th className="px-6 py-5 font-bold">التاريخ</th>
              <th className="px-6 py-5 font-bold">التطبيق</th>
              <th className="px-6 py-5 font-bold">المطعم / الفرع</th>
              <th className="px-6 py-5 font-bold">رقم الطلب</th>
              <th className="px-6 py-5 font-bold">المبلغ</th>
              <th className="px-6 py-5 font-bold">السبب</th>
              <th className="px-6 py-5 font-bold">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-medium">
                  لا توجد مخالفات مطابقة للبحث
                </td>
              </tr>
            ) : (
              filteredRows.map((r, i) => {
                const formattedDate = r.date ? new Date(r.date).toISOString().split('T')[0] : '—'
                return (
                  <tr key={i} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5 font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">{formattedDate}</td>
                    <td className="px-6 py-5 font-bold text-slate-900 dark:text-white whitespace-nowrap">{r.app}</td>
                    <td className="px-6 py-5">
                      <div className="font-extrabold text-slate-900 dark:text-white">{(r as any).restaurantName || '—'}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{r.branch}</div>
                    </td>
                    <td className="px-6 py-5 font-mono text-sm font-bold text-slate-800 dark:text-slate-200" dir="ltr">{r.orderNumber || '—'}</td>
                    <td className="px-6 py-5 font-mono font-extrabold text-red-600 dark:text-red-400 whitespace-nowrap">{r.amount} رس</td>
                    <td className="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium max-w-xs truncate">{r.reason || '—'}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${
                        r.status === 'تم الاسترداد' || r.status === 'Refunded' 
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' 
                          : r.status === 'مرفوضة' || r.status === 'Rejected' 
                          ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30' 
                          : r.status === 'بدون صورة' 
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30' 
                          : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-white/10'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}