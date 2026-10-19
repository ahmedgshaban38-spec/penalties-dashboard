'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, ImageOff, Upload, Image as ImageIcon, Loader2, Edit3, Check } from 'lucide-react'
import type { Penalty } from '@/lib/penalties'
import { supabase } from '@/lib/supabase'

interface PenaltiesTableProps {
  rows: Penalty[]
  onUpdateRow?: (orderNumber: string, updates: Partial<any>) => void
}

export function PenaltiesTable({ rows, onUpdateRow }: PenaltiesTableProps) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [rejectionInput, setRejectionInput] = useState('')
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)

  if (!rows || rows.length === 0) {
    return (
      <div className="p-16 text-center text-slate-400 font-bold text-sm">
        لا توجد مخالفات مسجلة تطابق التحديد الحالي
      </div>
    )
  }

  const handleStatusChange = async (row: any, newStatus: string, idx: number) => {
    const orderNo = String(row.orderNumber || '').trim()
    
    // تحديث في Supabase
    if (orderNo) {
      await supabase
        .from('penalties')
        .update({ status: newStatus })
        .eq('order_number', orderNo)
    }

    if (onUpdateRow) {
      onUpdateRow(orderNo, { status: newStatus })
    }

    // إذا اختار مرفوضة، نفتح له حقل كتابة سبب الرفض تلقائياً
    if (newStatus === 'مرفوضة' || newStatus === 'Rejected') {
      setEditingIdx(idx)
      setRejectionInput(row.rejectionReason || row.rejection_reason || '')
    }
  }

  const handleOrderStatusChange = async (row: any, newOrderStatus: string) => {
    const orderNo = String(row.orderNumber || '').trim()
    if (orderNo) {
      await supabase
        .from('penalties')
        .update({ order_status: newOrderStatus })
        .eq('order_number', orderNo)
    }
    if (onUpdateRow) {
      onUpdateRow(orderNo, { orderStatus: newOrderStatus, order_status: newOrderStatus })
    }
  }

  const handleSaveRejectionReason = async (row: any) => {
    const orderNo = String(row.orderNumber || '').trim()
    if (orderNo) {
      await supabase
        .from('penalties')
        .update({ rejection_reason: rejectionInput })
        .eq('order_number', orderNo)
    }
    if (onUpdateRow) {
      onUpdateRow(orderNo, { rejectionReason: rejectionInput, rejection_reason: rejectionInput })
    }
    setEditingIdx(null)
  }

  const handleUploadEvidence = async (e: React.ChangeEvent<HTMLInputElement>, row: any, idx: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingIdx(idx)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `penalty_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('evidence').getPublicUrl(fileName)
      const publicUrl = data.publicUrl
      const orderNo = String(row.orderNumber || '').trim()

      if (orderNo) {
        await supabase
          .from('penalties')
          .update({ evidence_link: publicUrl })
          .eq('order_number', orderNo)
      }

      if (onUpdateRow) {
        onUpdateRow(orderNo, { evidenceLink: publicUrl, evidence_link: publicUrl })
      }
    } catch (err) {
      console.error('Error uploading evidence:', err)
      alert('حدث خطأ أثناء رفع الصورة')
    } finally {
      setUploadingIdx(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
            <th className="px-4 py-4 font-bold">التاريخ</th>
            <th className="px-4 py-4 font-bold">التطبيق</th>
            <th className="px-4 py-4 font-bold">المطعم / الفرع</th>
            <th className="px-4 py-4 font-bold">رقم الطلب</th>
            <th className="px-4 py-4 font-bold">حالة الطلب</th>
            <th className="px-4 py-4 font-bold">المبلغ</th>
            <th className="px-4 py-4 font-bold">سبب الغرامة</th>
            <th className="px-4 py-4 font-bold">حالة الاعتراض</th>
            <th className="px-4 py-4 font-bold">سبب الرفض / ملاحظات</th>
            <th className="px-4 py-4 font-bold">الإثبات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {rows.map((row: any, idx) => {
            const formattedDate = row.date ? new Date(row.date).toISOString().split('T')[0] : '—'
            const orderStatus = row.orderStatus || row.order_status || 'تم التوصيل'
            const rejectionReason = row.rejectionReason || row.rejection_reason || ''
            const evidenceLink = row.evidenceLink || row.evidence_link || ''

            return (
              <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {formattedDate}
                </td>
                <td className="px-4 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                  {row.app}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="font-bold text-slate-900 dark:text-white">{row.restaurantName || row.restaurant_name || row.brand || row.branch}</div>
                  <div className="text-xs text-slate-400">{row.branch} {row.brand ? `· ${row.brand}` : ''}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-slate-700 dark:text-slate-300" dir="ltr">
                  {row.orderNumber || '—'}
                </td>
                
                {/* حالة الطلب: تم التوصيل أو ملغي */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={orderStatus}
                    onChange={(e) => handleOrderStatusChange(row, e.target.value)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-colors ${
                      orderStatus === 'ملغي (كنسل)'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                    }`}
                  >
                    <option value="تم التوصيل" className="bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white">تم التوصيل</option>
                    <option value="ملغي (كنسل)" className="bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white">ملغي (كنسل)</option>
                  </select>
                </td>

                <td className="px-4 py-4 whitespace-nowrap font-mono font-extrabold text-red-600 dark:text-red-400">
                  {row.amount} رس
                </td>
                <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-300 max-w-[160px] truncate" title={row.reason}>
                  {row.reason || '—'}
                </td>

                {/* تغيير حالة الاعتراض مباشرة */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row, e.target.value, idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border outline-none cursor-pointer transition-all ${
                      row.status === 'تم الاسترداد' || row.status === 'Refunded'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : row.status === 'مرفوضة' || row.status === 'Rejected'
                        ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30'
                        : row.status === 'لم يتم إرسال صورة للتحقق' || row.status === 'بدون صورة'
                        ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30'
                        : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <option value="قيد المراجعة" className="bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white">قيد المراجعة</option>
                    <option value="تم الاسترداد" className="bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white">تم الاسترداد</option>
                    <option value="مرفوضة" className="bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white">مرفوضة</option>
                    <option value="لم يتم إرسال صورة للتحقق" className="bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white">لم يتم إرسال صورة للتحقق</option>
                  </select>
                </td>

                {/* سبب الرفض (قابل للتعديل السريع) */}
                <td className="px-4 py-4 min-w-[180px]">
                  {editingIdx === idx ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={rejectionInput}
                        onChange={(e) => setRejectionInput(e.target.value)}
                        placeholder="اكتب سبب الرفض..."
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-blue-500 bg-white dark:bg-[#060913] text-slate-900 dark:text-white outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveRejectionReason(row)}
                        className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                        title="حفظ"
                      >
                        <Check className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingIdx(idx)
                        setRejectionInput(rejectionReason)
                      }}
                      className="group flex items-center justify-between gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-300 hover:text-blue-500 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      <span className="truncate max-w-[140px]">{rejectionReason || 'إضافة ملاحظة / سبب...'}</span>
                      <Edit3 className="size-3.5 opacity-0 group-hover:opacity-100 text-slate-400 shrink-0" />
                    </div>
                  )}
                </td>

                {/* رفع أو عرض صورة الإثبات */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {evidenceLink ? (
                      <a
                        href={evidenceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20 hover:underline"
                      >
                        <ImageIcon className="size-3.5" /> عرض
                      </a>
                    ) : null}
                    <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer transition-colors border border-slate-200 dark:border-white/10">
                      {uploadingIdx === idx ? (
                        <Loader2 className="size-3.5 animate-spin text-blue-500" />
                      ) : (
                        <Upload className="size-3.5 text-slate-500" />
                      )}
                      <span>{evidenceLink ? 'تغيير' : 'إرفاق'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadEvidence(e, row, idx)}
                        disabled={uploadingIdx === idx}
                      />
                    </label>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
