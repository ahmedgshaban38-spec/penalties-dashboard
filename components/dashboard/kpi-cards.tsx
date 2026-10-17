import { AlertTriangle, CheckCircle, ImageMinus, Percent, FileText } from 'lucide-react'
import type { Penalty } from '@/lib/penalties'

export function KpiCards({ rows }: { rows: Penalty[] }) {
  const totalPenalties = rows.length
  const totalAmount = rows.reduce((sum, r) => sum + (r.amount || 0), 0)
  
  const refundedRows = rows.filter(r => r.status === 'تم الاسترداد' || r.status === 'Refunded')
  const refundedAmount = refundedRows.reduce((sum, r) => sum + (r.amount || 0), 0)
  
  const rejectedCount = rows.filter(r => r.status === 'مرفوضة' || r.status === 'Rejected').length
  const missingImageCount = rows.filter(r => r.status === 'بدون صورة' || r.status === 'Missing Image').length
  
  const refundPercentage = totalAmount > 0 ? Math.round((refundedAmount / totalAmount) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      {/* إجمالي الغرامات */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 group">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl group-hover:scale-110 transition-transform"><FileText className="size-5" /></div>
          <h4 className="font-bold text-slate-600 dark:text-slate-400 text-sm">إجمالي الغرامات</h4>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{totalAmount.toLocaleString()} <span className="text-sm font-normal text-slate-500">رس</span></p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">{totalPenalties} مخالفة مسجلة</p>
        </div>
      </div>

      {/* المبالغ المستردة */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform"><CheckCircle className="size-5" /></div>
          <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">المبالغ المستردة</h4>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">{refundedAmount.toLocaleString()} <span className="text-sm font-normal text-emerald-500/70">رس</span></p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 font-semibold mt-1">{refundedRows.length} طلب مسترد</p>
        </div>
      </div>

      {/* نسبة الاسترداد */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-sm flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform"><Percent className="size-5" /></div>
          <h4 className="font-bold text-blue-800 dark:text-blue-400 text-sm">نسبة النجاح (الاسترداد)</h4>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">{refundPercentage}%</p>
          <p className="text-xs text-blue-600/70 dark:text-blue-500/70 font-semibold mt-1">من إجمالي المبالغ</p>
        </div>
      </div>

      {/* مرفوضة */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-sm flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-red-300 transition-all duration-300 group">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-2xl group-hover:scale-110 transition-transform"><AlertTriangle className="size-5" /></div>
          <h4 className="font-bold text-red-800 dark:text-red-400 text-sm">المطالبات المرفوضة</h4>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">{rejectedCount}</p>
          <p className="text-xs text-red-600/70 dark:text-red-500/70 font-semibold mt-1">تم رفضها نهائياً</p>
        </div>
      </div>

      {/* بدون صورة */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-amber-100 dark:border-amber-900/30 shadow-sm flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl hover:border-amber-300 transition-all duration-300 group">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform"><ImageMinus className="size-5" /></div>
          <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm">بدون صورة (مرفوض)</h4>
        </div>
        <div>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">{missingImageCount}</p>
          <p className="text-xs text-amber-600/70 dark:text-amber-500/70 font-semibold mt-1">بسبب عدم وجود إثبات</p>
        </div>
      </div>
    </div>
  )
}