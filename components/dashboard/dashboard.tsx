'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { AlertCircle, Database, Truck, LayoutDashboard, AlertTriangle, FileText, Store, LogOut, Plus, Download, Printer, X, Globe, Link as LinkIcon, MapPin, CheckCircle, Moon, Sun, ShieldCheck, TrendingUp, ArrowUpRight, Bell, Filter, Clock, Shield, Sparkles, History, FileDown, Award, Users, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import type { DataSource, Penalty } from '@/lib/penalties'
import { supabase } from '@/lib/supabase'
import { BranchFilter, ALL_BRANCHES } from './branch-filter'
import { AppSummary } from './app-summary'
import { KpiCards } from './kpi-cards'
import { ChartsSection } from './charts-section'
import { InsightsSection } from './insights-section'
import { PenaltiesTable } from './penalties-table'

const dict = {
  ar: {
    sidebarTitle: 'إدارة المطالبات', sidebarSubtitle: 'نظام العمليات المتقدم', dashboard: 'لوحة التحكم',
    penalties: 'المخالفات', claims: 'المطالبات', restaurants: 'المطاعم والفروع', auditLog: 'سجل التدقيق',
    teamLeaderboard: 'أداء الفريق', userName: 'أحمد جمال', logout: 'تسجيل الخروج', switchLang: 'English',
    overview: 'نظرة عامة على العمليات', managePenalties: 'إدارة المخالفات', claimsHistory: 'سجل المطالبات',
    restaurantsGuide: 'دليل الأداء والفروع', connected: 'قاعدة بيانات Supabase متصلة', records: 'سجل محفوظ',
    addPenalty: 'تسجيل مخالفة', exportExcel: 'تصدير إكسيل', printReport: 'طباعة تقرير PDF', downloadPdf: 'تحميل ملف PDF',
    addNewPenalty: 'تسجيل مخالفة جديدة', app: 'التطبيق', restaurantName: 'اسم المطعم', brand: 'البراند', branch: 'الفرع',
    orderNumber: 'رقم الطلب', amount: 'مبلغ المخالفة (رس)', refundedAmount: 'المبلغ المسترد (رس)', reason: 'سبب المخالفة', status: 'الحالة',
    cancel: 'إلغاء', save: 'حفظ في النظام', selectApp: 'اختر التطبيق...', 
    underReview: 'قيد المراجعة', rejected: 'مرفوضة', refunded: 'تم الاسترداد', missingImage: 'بدون صورة',
    successMsg: 'تم حفظ المخالفة بنجاح بحالة (قيد المراجعة)!', headers: ['التاريخ', 'التطبيق', 'اسم المطعم', 'البراند', 'الفرع', 'رقم الطلب', 'المبلغ', 'السبب', 'الحالة'],
    claimFormTitle: 'تحديث حالة المطالبة وحسم النزاع', claimOrderNumber: 'رقم الطلب المراد حسمه', claimStatus: 'النتيجة النهائية للمطالبة',
    claimRejectionReason: 'سبب الرفض (إن وجد)', claimEvidence: 'صورة الإثبات أو الفاتورة', saveClaim: 'حسم وتحديث حالة المخالفة',
    claimSuccess: 'تم حسم المطالبة وتحديث حالة المخالفة بنجاح في النظام!',
    restaurantsGuideDesc: 'تحليل شامل لأداء الفروع، حجم الغرامات، ونسب التأثير التشغيلي.',
    branchesCount: 'فروع نشطة', totalFines: 'إجمالي الغرامات', penaltiesCount: 'مخالفات مسجلة',
    recoveryTitle: 'حاسبة كفاءة واسترداد الأرباح', recoverySubtitle: 'متابعة المبالغ المستردة مقابل إجمالي الغرامات المخصومة لحظياً',
    totalFinesLabel: 'إجمالي الغرامات المخصومة', totalRefundedLabel: 'إجمالي المبالغ المستردة', recoveryRateLabel: 'نسبة نجاح الاسترداد',
    branchAnalysis: 'تحليل الغرامات حسب الفروع', topReasons: 'أكثر الغرامات انتشاراً وأسبابها',
    alertTitle: 'تنبيه تشغيلي عاجل', alertDesc: 'لديك حالات قيد المراجعة تتطلب متابعة مستمرة لضمان الاسترداد.',
    allStatus: 'الكل', filterReview: 'قيد المراجعة', filterRefunded: 'المستردة', filterRejected: 'المرفوضة',
    printHeaderTitle: 'التقرير التنفيذي لإدارة الغرامات والمطالبات', printDate: 'تاريخ التقرير:',
    slaWarning: 'مؤشر مهل الاعتراض الحرجة',
    roleManager: 'مدير العمليات (صلاحية كاملة)', roleSupervisor: 'مشرف الفرع (صلاحية إدخال)',
    aiAssistantTitle: 'المساعد الذكي لصياغة الاعتراضات (AI)', generateAiText: 'توليد مسودة اعتراض رسمية',
    auditLogTitle: 'سجل التدقيق والمتابعة التاريخية', auditDesc: 'متابعة لحظية لكافة العمليات والتعديلات المسجلة في النظام',
    leaderboardTitle: 'لوحة شرف أداء المشرفين ومعدل الاسترداد'
  },
  en: {
    sidebarTitle: 'Claims Ops', sidebarSubtitle: 'Enterprise Engine', dashboard: 'Dashboard',
    penalties: 'Penalties', claims: 'Claims', restaurants: 'Restaurants', auditLog: 'Audit Log',
    teamLeaderboard: 'Team Performance', userName: 'Ahmed Gamal', logout: 'Log Out', switchLang: 'العربية',
    overview: 'Operations Overview', managePenalties: 'Penalties Log', claimsHistory: 'Claims Management',
    restaurantsGuide: 'Branches & Performance', connected: 'Database Connected', records: 'records',
    addPenalty: 'Log Penalty', exportExcel: 'Export Excel', printReport: 'Print PDF Report', downloadPdf: 'Download PDF',
    addNewPenalty: 'Add New Penalty', app: 'App', restaurantName: 'Restaurant', brand: 'Brand', branch: 'Branch',
    orderNumber: 'Order Number', amount: 'Amount (SAR)', refundedAmount: 'Refunded (SAR)', reason: 'Reason', status: 'Status',
    cancel: 'Cancel', save: 'Save Record', selectApp: 'Select App...', 
    underReview: 'Under Review', rejected: 'Rejected', refunded: 'Refunded', missingImage: 'Missing Image',
    successMsg: 'Penalty saved successfully with Under Review status!', headers: ['Date', 'App', 'Restaurant', 'Brand', 'Branch', 'Order No', 'Amount', 'Reason', 'Status'],
    claimFormTitle: 'Update Claim & Settle Penalty Status', claimOrderNumber: 'Order Number to Settle', claimStatus: 'Final Claim Decision',
    claimRejectionReason: 'Rejection Reason', claimEvidence: 'Evidence or Receipt Image', saveClaim: 'Settle & Sync Penalty',
    claimSuccess: 'Claim settled and penalty status updated successfully!',
    restaurantsGuideDesc: 'Comprehensive analysis of branch performance, fine volume, and operational impact.',
    branchesCount: 'Active Branches', totalFines: 'Total Fines', penaltiesCount: 'Recorded Penalties',
    recoveryTitle: 'Recovery & Profit Efficiency Calculator', recoverySubtitle: 'Real-time tracking of refunded amounts vs total deducted fines',
    totalFinesLabel: 'Total Deducted Fines', totalRefundedLabel: 'Total Refunded Amount', recoveryRateLabel: 'Recovery Success Rate',
    branchAnalysis: 'Branch Penalties Analysis', topReasons: 'Top Frequent Penalty Reasons',
    alertTitle: 'Urgent Operational Alert', alertDesc: 'You have pending review cases requiring continuous follow-up for recovery.',
    allStatus: 'All', filterReview: 'Under Review', filterRefunded: 'Refunded', filterRejected: 'Rejected',
    printHeaderTitle: 'Executive Penalties & Claims Report', printDate: 'Report Date:',
    slaWarning: 'Critical SLA Objection Deadlines',
    roleManager: 'Operations Manager (Full Access)', roleSupervisor: 'Branch Supervisor (Input Access)',
    aiAssistantTitle: 'AI Objection Assistant', generateAiText: 'Generate Formal Objection Draft',
    auditLogTitle: 'Activity Audit Trail', auditDesc: 'Real-time tracking of all operations and records updates in the system',
    leaderboardTitle: 'Supervisors Performance & Recovery Leaderboard'
  }
}

export function Dashboard({ 
  rows: initialRows, 
  source, 
  initialRole = 'SUPERVISOR',
  userName = 'أحمد جمال'
}: { 
  rows: Penalty[]; 
  source: DataSource; 
  initialRole?: 'MANAGER' | 'SUPERVISOR';
  userName?: string;
}) {
  const [lang, setLang] = useState<'ar' | 'en'>('ar') 
  const t = dict[lang] 
  
  const [rows, setRows] = useState<Penalty[]>(initialRows)
  const [dbClaims, setDbClaims] = useState<any[]>([])
  const [isDark, setIsDark] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [userRole] = useState<'MANAGER' | 'SUPERVISOR'>(initialRole)
  
  const [aiDraft, setAiDraft] = useState('')
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const [auditLogs, setAuditLogs] = useState<Array<{ id: number; action: string; user: string; time: string; type: 'success' | 'info' | 'warning' }>>([
    { id: 1, action: 'تسجيل الدخول للنظام والاتصال بقاعدة البيانات', user: userName, time: 'الآن', type: 'info' }
  ])

  useEffect(() => {
    setRows(initialRows)
  }, [initialRows])

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const { data } = await supabase.from('claims').select('*').order('id', { ascending: false })
        if (data) setDbClaims(data)
      } catch (err) {
        console.error('Error fetching claims:', err)
      }
    }
    fetchClaims()
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }
  
  const [branch, setBranch] = useState(ALL_BRANCHES)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  const [toast, setToast] = useState<{message: string, type: 'success'|'error', id: number} | null>(null)
  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    const id = Date.now()
    setToast({ message, type, id })
    setTimeout(() => setToast(current => current?.id === id ? null : current), 3500)
  }
  
  // حالة المخالفة الجديدة مثبتة دائماً على (قيد المراجعة) لمنع التلاعب
  const [formData, setFormData] = useState({ 
    app: '', 
    restaurantName: '', 
    brand: '', 
    branch: '', 
    orderNumber: '', 
    amount: '', 
    refundedAmount: '', 
    reason: '', 
    status: t.underReview 
  })

  // بيانات المطالبة: الافتراضي تم الاسترداد
  const [claimData, setClaimData] = useState({ 
    orderNumber: '', 
    status: t.refunded, 
    rejectionReason: '', 
    evidenceLink: '' 
  })

  const branches = useMemo(() => [...new Set(rows.map((r) => r.branch))].sort((a, b) => a.localeCompare(b, lang === 'ar' ? 'ar' : 'en')), [rows, lang])
  
  const filteredByBranch = useMemo(() => {
    if (branch === ALL_BRANCHES) return rows
    return rows.filter((r) => r.branch === branch || (r as any).restaurantName === branch || (r as any).brand === branch)
  }, [rows, branch])

  const filtered = useMemo(() => {
    const list = filteredByBranch.map(r => ({
      ...r,
      date: r.date ? new Date(r.date).toISOString().split('T')[0] : r.date
    }))
    if (statusFilter === 'ALL') return list
    if (statusFilter === 'REVIEW') return list.filter(r => r.status === t.underReview)
    if (statusFilter === 'REFUNDED') return list.filter(r => r.status === t.refunded)
    if (statusFilter === 'REJECTED') return list.filter(r => r.status === t.rejected || r.status === t.missingImage)
    return list
  }, [filteredByBranch, statusFilter, t])

  const reviewCount = useMemo(() => filteredByBranch.filter(r => r.status === t.underReview).length, [filteredByBranch, t])

  const slaAlerts = useMemo(() => {
    const now = new Date().getTime()
    return filteredByBranch.filter(r => {
      if (r.status !== t.underReview) return false
      if (!r.date) return false
      const penaltyDate = new Date(r.date).getTime()
      const diffDays = Math.floor((now - penaltyDate) / (1000 * 60 * 60 * 24))
      return diffDays >= 3
    })
  }, [filteredByBranch, t])

  const { totalFines, totalRefunded, recoveryRate } = useMemo(() => {
    let fines = 0
    let refunded = 0
    filteredByBranch.forEach(r => {
      const amount = Number(r.amount) || 0
      fines += amount
      if (r.status === 'تم الاسترداد' || r.status === 'Refunded') {
        refunded += amount
      }
    })
    const rate = fines > 0 ? Math.round((refunded / fines) * 100) : 0
    return { totalFines: fines, totalRefunded: refunded, recoveryRate: rate }
  }, [filteredByBranch])

  const branchStats = useMemo(() => {
    const stats: Record<string, { count: number; amount: number }> = {}
    filteredByBranch.forEach(r => {
      const b = r.branch || 'غير محدد'
      if (!stats[b]) stats[b] = { count: 0, amount: 0 }
      stats[b].count += 1
      stats[b].amount += r.amount || 0
    })
    return Object.entries(stats).sort((a, b) => b[1].amount - a[1].amount).slice(0, 5)
  }, [filteredByBranch])

  const reasonStats = useMemo(() => {
    const stats: Record<string, { count: number; amount: number }> = {}
    filteredByBranch.forEach(r => {
      const reason = r.reason || 'بدون سبب محدد'
      if (!stats[reason]) stats[reason] = { count: 0, amount: 0 }
      stats[reason].count += 1
      stats[reason].amount += r.amount || 0
    })
    return Object.entries(stats).sort((a, b) => b[1].count - a[1].count).slice(0, 5)
  }, [filteredByBranch])

  const claimsList = useMemo(() => {
    const fromPenalties = filteredByBranch.filter(r => (r as any).rejectionReason || (r as any).evidenceLink || r.status === t.rejected || r.status === t.refunded || r.status === t.missingImage)
    const fromDb = dbClaims.map(c => ({
      orderNumber: c.order_number,
      branch: c.branch || '—',
      rejectionReason: c.rejection_reason,
      evidenceLink: c.evidence_link,
      status: c.status
    }))
    return [...fromDb, ...fromPenalties]
  }, [filteredByBranch, dbClaims, t])

  const restaurantStats = useMemo(() => {
    const stats: Record<string, { name: string; branches: Set<string>; totalAmount: number; penaltyCount: number }> = {}
    filteredByBranch.forEach(r => {
      const name = (r as any).restaurantName || (r as any).brand || r.branch || 'غير محدد'
      if (!stats[name]) stats[name] = { name, branches: new Set(), totalAmount: 0, penaltyCount: 0 }
      if (r.branch) stats[name].branches.add(r.branch)
      stats[name].totalAmount += r.amount || 0
      stats[name].penaltyCount += 1
    })
    return Object.values(stats).map(s => ({ ...s, branchesCount: s.branches.size })).sort((a, b) => b.totalAmount - a.totalAmount)
  }, [filteredByBranch])

  const handleExportExcel = () => {
    const csvContent = filteredByBranch.map(row => `${row.date ? new Date(row.date).toISOString().split('T')[0] : ''},${row.app || ''},${(row as any).restaurantName || ''},${(row as any).brand || ''},${row.branch || ''},${row.orderNumber || ''},${row.amount || 0},${row.reason || ''},${row.status || ''}`);
    const csv = '\uFEFF' + [t.headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `Penalties_Report.csv`; link.click();
    
    setAuditLogs(prev => [{ id: Date.now(), action: 'تصدير تقرير إكسيل للعمليات', user: userName, time: 'الآن', type: 'success' }, ...prev])
  }

  const handlePrintReport = () => {
    window.print();
    setAuditLogs(prev => [{ id: Date.now(), action: 'طباعة التقرير التنفيذي للغرامات', user: userName, time: 'الآن', type: 'success' }, ...prev])
  }

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true)
    try {
      setTimeout(() => {
        window.print()
        setIsDownloadingPdf(false)
        showToast('تم إعداد وتحميل ملف الـ PDF بنجاح!', 'success')
        setAuditLogs(prev => [{ id: Date.now(), action: 'تحميل التقرير بصيغة PDF مباشرة', user: userName, time: 'الآن', type: 'success' }, ...prev])
      }, 600)
    } catch (err) {
      setIsDownloadingPdf(false)
      showToast('حدث خطأ أثناء تحميل الـ PDF', 'error')
    }
  }

  const handleGenerateAiObjection = () => {
    setIsGeneratingAi(true)
    setTimeout(() => {
      setAiDraft(`السادة إدارة دعم منصة التوصيل المحترمين،\n\nنود إفادتكم بأن الغرامة المالية المسجلة على الطلب رقم (${claimData.orderNumber || 'غير محدد'}) غير مبررة، حيث أننا قمنا بمراجعة الكاميرات وسجلات المطبخ وتبين التزام الفرع بكافة معايير الجودة والتحضير في الوقت المحدد.\n\nلذا نرجو التكرم بإعادة مراجعة الحالة وإلغاء الخصم ورد المبلغ لصالح المحفظة في أقرب وقت.\n\nولكم جزيل الشكر،\nإدارة العمليات - ${userName}`)
      setIsGeneratingAi(false)
      showToast('تم توليد مسودة الاعتراض بنجاح!', 'success')
      setAuditLogs(prev => [{ id: Date.now(), action: 'توليد مسودة اعتراض بالذكاء الاصطناعي للطلب ' + (claimData.orderNumber || ''), user: userName, time: 'الآن', type: 'success' }, ...prev])
    }, 800)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `evidence_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('evidence').getPublicUrl(filePath)
      setClaimData(prev => ({ ...prev, evidenceLink: data.publicUrl }))
      showToast('تم رفع صورة الإثبات بنجاح!', 'success')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      showToast(`فشل رفع الصورة: ${error.message || 'خطأ غير معروف'}`, 'error')
    } finally {
      setIsUploadingImage(false)
    }
  }

  // حفظ المخالفة بحالة "قيد المراجعة" دائماً
  const handleSubmitPenalty = async (e: React.FormEvent) => {
    e.preventDefault();
    const penaltyAmount = parseFloat(formData.amount) || 0;

    const payload = {
      app: formData.app,
      restaurant_name: formData.restaurantName,
      brand: formData.brand,
      branch: formData.branch,
      order_number: formData.orderNumber,
      amount: penaltyAmount,
      reason: formData.reason,
      status: t.underReview, // حالة ثابتة افتراضياً
      created_by: userName
    };

    const { error } = await supabase.from('penalties').insert([payload]);

    if (error) {
      console.error('خطأ Supabase أثناء الإدخال:', error.message);
      showToast(`خطأ في الحفظ: ${error.message}`, 'error');
      return;
    }

    const newPenalty: Penalty = {
      date: new Date().toISOString(),
      app: formData.app,
      branch: formData.branch,
      orderNumber: formData.orderNumber,
      amount: penaltyAmount,
      reason: formData.reason,
      status: t.underReview,
      restaurantName: formData.restaurantName,
      brand: formData.brand
    } as any;

    setRows(prev => [newPenalty, ...prev]);
    showToast(t.successMsg, 'success');
    setIsAddModalOpen(false);
    setFormData({ app: '', restaurantName: '', brand: '', branch: '', orderNumber: '', amount: '', refundedAmount: '', reason: '', status: t.underReview });
    setAuditLogs(prev => [{ id: Date.now(), action: `تسجيل مخالفة جديدة بقيمة ${formData.amount} رس لفرع ${formData.branch} (قيد المراجعة)`, user: userName, time: 'الآن', type: 'info' }, ...prev]);
  }

  // حفظ المطالبة وتحديث حالة المخالفة مباشرة في جدول penalties
  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOrderNumber = claimData.orderNumber.trim();

    // 1. تسجيل المطالبة في جدول claims
    const { data, error } = await supabase.from('claims').insert([{
      order_number: cleanOrderNumber,
      branch: branch !== ALL_BRANCHES ? branch : 'الكل',
      status: claimData.status,
      rejection_reason: claimData.rejectionReason,
      evidence_link: claimData.evidenceLink,
      created_by: userName
    }]).select();

    if (error) {
      console.error('خطأ Supabase أثناء حفظ المطالبة:', error.message);
      showToast(`خطأ في حفظ المطالبة: ${error.message}`, 'error');
      return;
    }

    // 2. تحديث سجل المخالفة الأصلي في قاعدة بيانات Supabase ليسمع فوراً
    const { error: penaltyUpdateError } = await supabase
      .from('penalties')
      .update({ status: claimData.status })
      .eq('order_number', cleanOrderNumber);

    if (penaltyUpdateError) {
      console.warn('تنبيه: تم تسجيل المطالبة ولكن لم يتم العثور على مخالفة مطابقة لرقم الطلب لتحديثها:', penaltyUpdateError.message);
    }

    // 3. تحديث الواجهة والـ State لحظياً لجدول المخالفات والمطالبات ونسبة الاسترداد
    setRows(prevRows => prevRows.map(r => {
      if (String(r.orderNumber).trim() === cleanOrderNumber) {
        return { ...r, status: claimData.status };
      }
      return r;
    }));

    if (data && data[0]) {
      setDbClaims(prev => [data[0], ...prev]);
    }

    showToast(t.claimSuccess, 'success');
    setClaimData({ orderNumber: '', status: t.refunded, rejectionReason: '', evidenceLink: '' });
    setAuditLogs(prev => [{ id: Date.now(), action: `حسم المطالبة وتحديث حالة المخالفة للطلب ${cleanOrderNumber} إلى (${claimData.status})`, user: userName, time: 'الآن', type: 'warning' }, ...prev]);
  }

  const isRtl = lang === 'ar';
  const sidebarPosition = isRtl ? 'right-0' : 'left-0';
  const mainMargin = isRtl ? 'mr-72' : 'ml-72';

  const userInitials = useMemo(() => {
    if (!userName) return 'U'
    const parts = userName.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return userName.slice(0, 2).toUpperCase()
  }, [userName])

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans relative overflow-x-hidden transition-colors duration-300 selection:bg-blue-600 selection:text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      
      <div ref={reportRef} className="hidden print:block w-full bg-white text-black p-8 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-black">{t.printHeaderTitle}</h1>
            <p className="text-sm text-gray-600 mt-1">{userName} · {userRole === 'MANAGER' ? t.roleManager : t.roleSupervisor}</p>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold">{t.printDate} {new Date().toLocaleDateString()}</p>
            <p className="text-xs text-gray-500 mt-1">الفرع: {branch}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="border border-black p-4 rounded-lg">
            <p className="text-xs font-bold text-gray-600">{t.totalFinesLabel}</p>
            <p className="text-2xl font-black mt-2">{totalFines.toLocaleString()} رس</p>
          </div>
          <div className="border border-black p-4 rounded-lg">
            <p className="text-xs font-bold text-gray-600">{t.totalRefundedLabel}</p>
            <p className="text-2xl font-black mt-2 text-emerald-600">{totalRefunded.toLocaleString()} رس</p>
          </div>
          <div className="border border-black p-4 rounded-lg">
            <p className="text-xs font-bold text-gray-600">{t.recoveryRateLabel}</p>
            <p className="text-2xl font-black mt-2 text-blue-600">{recoveryRate}%</p>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-4">تفاصيل المخالفات المسجلة</h3>
        <table className="w-full border-collapse border border-black text-sm text-right">
          <thead>
            <tr className="bg-gray-100 text-black border-b border-black">
              {t.headers.map((h, i) => (
                <th key={i} className="border border-black px-4 py-2 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredByBranch.map((r, i) => {
              const formattedDate = r.date ? new Date(r.date).toISOString().split('T')[0] : '—'
              return (
                <tr key={i} className="border-b border-black">
                  <td className="border border-black px-4 py-2">{formattedDate}</td>
                  <td className="border border-black px-4 py-2">{r.app}</td>
                  <td className="border border-black px-4 py-2">{(r as any).restaurantName || '—'}</td>
                  <td className="border border-black px-4 py-2">{(r as any).brand || '—'}</td>
                  <td className="border border-black px-4 py-2">{r.branch}</td>
                  <td className="border border-black px-4 py-2">{r.orderNumber || '—'}</td>
                  <td className="border border-black px-4 py-2 font-bold">{r.amount} رس</td>
                  <td className="border border-black px-4 py-2">{r.reason || '—'}</td>
                  <td className="border border-black px-4 py-2">{r.status}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="print:hidden contents">
        <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-10 w-[600px] h-[600px] bg-indigo-600/10 dark:bg-purple-600/15 rounded-full blur-[160px] pointer-events-none"></div>

        <aside className={`w-72 bg-white/80 dark:bg-[#0a0f1d]/80 backdrop-blur-2xl border-x border-slate-200 dark:border-white/10 flex flex-col fixed inset-y-0 ${sidebarPosition} z-50 shadow-xl transition-colors duration-300`}>
          <div className="p-8 flex items-center gap-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/30 text-white">
              <Truck className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight dark:text-white">{t.sidebarTitle}</h2>
              <span className="text-[11px] font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">{t.sidebarSubtitle}</span>
            </div>
          </div>
          
          <nav className="flex-1 py-8 px-5 space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
              { id: 'penalties', icon: AlertTriangle, label: t.penalties },
              { id: 'claims', icon: FileText, label: t.claims },
              { id: 'restaurants', icon: Store, label: t.restaurants },
              { id: 'audit', icon: History, label: t.auditLog },
              { id: 'leaderboard', icon: Award, label: t.teamLeaderboard }
            ].map((item) => {
              if (userRole === 'SUPERVISOR' && (item.id === 'restaurants' || item.id === 'audit' || item.id === 'leaderboard')) return null
              return (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm group ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 scale-[1.02] border border-white/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent'
                  }`}
                >
                  <item.icon className={`size-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`} /> 
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-[#060913]">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="size-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold shadow-md border border-white/20 text-xs">
                {userInitials}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-extrabold truncate">
                  {userRole === 'MANAGER' ? 'مدير العمليات (صلاحية كاملة)' : 'مشرف الفرع (صلاحية إدخال)'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl transition-all font-semibold text-xs border border-slate-200 dark:border-white/10"><Globe className="size-4 text-blue-500 dark:text-blue-400" /> {t.switchLang}</button>
              
              <button 
                type="button"
                onClick={async () => {
                  const { supabase } = await import('@/lib/supabase')
                  await supabase.auth.signOut()
                  window.location.href = '/'
                }}
                title={t.logout}
                className="flex items-center justify-center px-4 py-2.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all border border-red-500/20 shadow-sm"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </aside>

        <main className={`flex-1 ${mainMargin} min-h-screen relative z-10`}>
          <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
            <div className="flex items-center justify-between px-10 py-5 max-w-[1600px] mx-auto">
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse"></span>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {activeTab === 'dashboard' && t.overview}
                  {activeTab === 'penalties' && t.managePenalties}
                  {activeTab === 'claims' && t.claimsHistory}
                  {activeTab === 'restaurants' && t.restaurantsGuide}
                  {activeTab === 'audit' && t.auditLogTitle}
                  {activeTab === 'leaderboard' && t.teamLeaderboard}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <BranchFilter branches={branches} value={branch} onChange={setBranch} />
                <button onClick={handleDownloadPdf} disabled={isDownloadingPdf} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all shadow-md shadow-blue-500/20 border border-white/20">
                  <FileDown className="size-4 text-amber-300" /> {isDownloadingPdf ? 'جاري التحميل...' : t.downloadPdf}
                </button>
                <button onClick={handlePrintReport} className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm">
                  <Printer className="size-4 text-blue-500" /> {t.printReport}
                </button>
                <button onClick={toggleDarkMode} className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all shadow-sm hover:scale-105">
                  {isDark ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5 text-indigo-600" />}
                </button>
              </div>
            </div>
          </header>

          <div className="p-10 max-w-[1600px] mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
              {activeTab === 'dashboard' && (
                <div className="flex flex-col gap-8">
                  {slaAlerts.length > 0 && (
                    <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/30 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-xl">
                      <div className="p-3 bg-red-500/20 text-red-500 rounded-xl animate-pulse">
                        <Clock className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-red-600 dark:text-red-400 text-sm">{t.slaWarning} ({slaAlerts.length})</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">تنبيه: اقتربت مهلة رفع الاعتراض على بعض الغرامات المعلقة على الانتهاء، يرجى سرعة المتابعة.</p>
                      </div>
                    </div>
                  )}

                  {reviewCount > 0 && (
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-5 rounded-2xl flex items-center gap-4 backdrop-blur-xl">
                      <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl animate-bounce">
                        <Bell className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-amber-600 dark:text-amber-400 text-sm">{t.alertTitle} ({reviewCount})</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{t.alertDesc}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 backdrop-blur-xl px-5 py-3 rounded-2xl w-fit shadow-lg border border-slate-200 dark:border-white/10">
                    <Database className="size-4 text-emerald-500 dark:text-emerald-400 animate-pulse" /> {t.connected} · <span className="text-slate-900 dark:text-white font-extrabold">{rows.length} {t.records}</span>
                  </div>

                  <div className="bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-2xl transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                          <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <ShieldCheck className="size-6" />
                          </span>
                          {t.recoveryTitle}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.recoverySubtitle}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                      <div className="bg-slate-50 dark:bg-[#060913] p-6 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.totalFinesLabel}</span>
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{totalFines.toLocaleString()}</span>
                          <span className="text-sm font-semibold text-slate-400">رس</span>
                        </div>
                        <span className="text-xs text-slate-400 mt-2">من {filteredByBranch.length} مخالفة نشطة</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#060913] p-6 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.totalRefundedLabel}</span>
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{totalRefunded.toLocaleString()}</span>
                          <span className="text-sm font-semibold text-slate-400">رس</span>
                        </div>
                        <span className="text-xs text-emerald-500/80 mt-2 font-medium">تم استرجاعها بنجاح</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#060913] p-6 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col justify-between">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.recoveryRateLabel}</span>
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">{recoveryRate}%</span>
                          <ArrowUpRight className="size-5 text-blue-500" />
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                          <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(recoveryRate, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <AppSummary rows={filteredByBranch} />
                  <KpiCards rows={filteredByBranch} />
                  <ChartsSection rows={filteredByBranch} />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-2xl">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <MapPin className="size-5 text-blue-500" />
                        {t.branchAnalysis}
                      </h3>
                      <div className="space-y-4">
                        {branchStats.length === 0 ? (
                          <p className="text-sm text-slate-400">لا توجد بيانات</p>
                        ) : (
                          branchStats.map(([branchName, data], i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#060913] rounded-2xl border border-slate-100 dark:border-white/10">
                              <div>
                                <p className="font-extrabold text-slate-900 dark:text-white text-sm">{branchName}</p>
                                <span className="text-xs text-slate-400">{data.count} مخالفة مسجلة</span>
                              </div>
                              <span className="font-mono font-extrabold text-red-600 dark:text-red-400 text-sm">{data.amount.toLocaleString()} رس</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="bg-white/90 dark:bg-[#0a0f1d]/90 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-200/80 dark:border-white/10 shadow-2xl">
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="size-5 text-amber-500" />
                        {t.topReasons}
                      </h3>
                      <div className="space-y-4">
                        {reasonStats.length === 0 ? (
                          <p className="text-sm text-slate-400">لا توجد بيانات</p>
                        ) : (
                          reasonStats.map(([reason, data], i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#060913] rounded-2xl border border-slate-100 dark:border-white/10">
                              <div className="max-w-[70%]">
                                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{reason}</p>
                                <span className="text-xs text-slate-400">{data.count} مرات تكرار</span>
                              </div>
                              <span className="font-mono font-extrabold text-slate-700 dark:text-slate-300 text-sm">{data.amount.toLocaleString()} رس</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <InsightsSection rows={filteredByBranch} allRows={rows} selectedBranch={branch} />
                </div>
              )}

              {activeTab === 'penalties' && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between bg-white dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10">
                    <div className="flex gap-4">
                      <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-2xl text-sm font-extrabold shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-0.5 border border-white/20"><Plus className="size-5" /> {t.addPenalty}</button>
                      <button onClick={handleExportExcel} className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 px-6 py-3.5 rounded-2xl text-sm font-extrabold transition-all"><Download className="size-5 text-emerald-500 dark:text-emerald-400" /> {t.exportExcel}</button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between flex-wrap gap-4 bg-slate-50/50 dark:bg-white/5">
                      <div className="flex items-center gap-2 bg-white dark:bg-[#060913] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                        <Filter className="size-4 text-slate-400 mr-2 ml-1" />
                        {[
                          { id: 'ALL', label: t.allStatus },
                          { id: 'REVIEW', label: t.filterReview },
                          { id: 'REFUNDED', label: t.filterRefunded },
                          { id: 'REJECTED', label: t.filterRejected }
                        ].map(btn => (
                          <button
                            key={btn.id}
                            onClick={() => setStatusFilter(btn.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                              statusFilter === btn.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <PenaltiesTable key={branch + statusFilter + rows.length} rows={filtered} />
                  </div>
                </div>
              )}

              {activeTab === 'claims' && (
                <div className="flex flex-col gap-8">
                  <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-8 relative">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3"><FileText className="size-7 text-blue-600 dark:text-blue-400" /> {t.claimFormTitle}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تحديث نتيجة الاعتراض هنا سيقوم تلقائياً بتحديث حالة المخالفة الأصلية في قاعدة البيانات وجدول المخالفات.</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleGenerateAiObjection} 
                        disabled={isGeneratingAi}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-purple-500/25 transition-all border border-white/20"
                      >
                        <Sparkles className="size-4 text-amber-300" /> {isGeneratingAi ? 'جاري التوليد...' : t.generateAiText}
                      </button>
                    </div>

                    {aiDraft && (
                      <div className="mb-8 p-6 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-500/30 text-slate-800 dark:text-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                            <Sparkles className="size-4" /> مسودة الاعتراض الذكية جاهزة للنسخ:
                          </span>
                          <button onClick={() => { navigator.clipboard.writeText(aiDraft); showToast('تم نسخ المسودة للحافظة!', 'success') }} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">نسخ النص</button>
                        </div>
                        <p className="text-sm whitespace-pre-line leading-relaxed font-medium">{aiDraft}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmitClaim} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.claimOrderNumber} <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          required 
                          placeholder="أدخل رقم الطلب المسجل في المخالفات بالضبط"
                          className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-900 dark:text-white" 
                          value={claimData.orderNumber} 
                          onChange={e => setClaimData({...claimData, orderNumber: e.target.value})} 
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.claimStatus} <span className="text-red-500">*</span></label>
                        <select 
                          required 
                          className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-900 dark:text-white" 
                          value={claimData.status} 
                          onChange={e => setClaimData({...claimData, status: e.target.value})}
                        >
                          <option value={t.refunded} className="bg-white dark:bg-[#060913]">تم الاسترداد (نجاح الاعتراض)</option>
                          <option value={t.rejected} className="bg-white dark:bg-[#060913]">مرفوضة (رفض التطبيق)</option>
                          <option value={t.missingImage} className="bg-white dark:bg-[#060913]">بدون صورة</option>
                          <option value={t.underReview} className="bg-white dark:bg-[#060913]">قيد المراجعة (معلق)</option>
                        </select>
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.claimRejectionReason}</label>
                        <input 
                          type="text" 
                          placeholder="سبب الرفض أو ملاحظات الاسترداد إن وجدت"
                          className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-900 dark:text-white" 
                          value={claimData.rejectionReason} 
                          onChange={e => setClaimData({...claimData, rejectionReason: e.target.value})} 
                        />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.claimEvidence}</label>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <label className="flex-1 w-full flex items-center justify-center gap-3 h-14 px-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-[#060913] hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-all">
                            {isUploadingImage ? (
                              <Loader2 className="size-5 text-blue-500 animate-spin" />
                            ) : (
                              <Upload className="size-5 text-blue-500" />
                            )}
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                              {isUploadingImage ? 'جاري رفع الصورة إلى التخزين...' : 'اختر صورة الفاتورة / الإثبات من جهازك'}
                            </span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploadingImage} />
                          </label>

                          {claimData.evidenceLink && (
                            <a href={claimData.evidenceLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl text-xs font-bold border border-blue-500/20 whitespace-nowrap hover:underline">
                              <ImageIcon className="size-4" /> معاينة الصورة المرفوعة
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2 flex justify-end mt-4 pt-8 border-t border-slate-100 dark:border-white/10">
                        <button type="submit" disabled={isUploadingImage} className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-extrabold shadow-xl shadow-blue-500/25 transition-all hover:-translate-y-0.5 border border-white/20 disabled:opacity-50">
                          {t.saveClaim}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5"><h3 className="text-lg font-bold text-slate-900 dark:text-white">سجل المطالبات الحالي</h3></div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-right">
                        <thead><tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-500 dark:text-slate-400"><th className="px-6 py-5 font-bold">رقم الطلب</th><th className="px-6 py-5 font-bold">الفرع</th><th className="px-6 py-5 font-bold">سبب الرفض</th><th className="px-6 py-5 font-bold">الإثبات</th><th className="px-6 py-5 font-bold">حالة المطالبة</th></tr></thead>
                        <tbody>
                          {claimsList.length === 0 ? (<tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium">لا توجد مطالبات مسجلة حتى الآن</td></tr>) : (
                            claimsList.map((r, i) => (
                              <tr key={i} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-5 font-mono text-sm font-bold text-slate-800 dark:text-slate-200" dir="ltr">{r.orderNumber}</td>
                                <td className="px-6 py-5 font-bold text-slate-900 dark:text-white whitespace-nowrap">{r.branch}</td>
                                <td className="px-6 py-5 text-slate-600 dark:text-slate-300 font-medium">{(r as any).rejectionReason || '—'}</td>
                                <td className="px-6 py-5">
                                  {(r as any).evidenceLink ? (
                                    <a href={(r as any).evidenceLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:underline bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-xl w-fit border border-blue-500/20">
                                      <ImageIcon className="size-4" /> فتح الإثبات
                                    </a>
                                  ) : '—'}
                                </td>
                                <td className="px-6 py-5"><span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${r.status === t.refunded ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' : r.status === t.rejected ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30' : r.status === t.missingImage ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-white/10'}`}>{r.status}</span></td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'audit' && userRole === 'MANAGER' && (
                <div className="flex flex-col gap-8">
                  <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-3"><History className="size-7 text-blue-600 dark:text-blue-400" /> {t.auditLogTitle}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{t.auditDesc}</p>
                  </div>
                  <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden p-6">
                    <div className="space-y-4">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-[#060913] rounded-2xl border border-slate-100 dark:border-white/10">
                          <div className="flex items-center gap-4">
                            <span className={`size-3 rounded-full ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                            <div>
                              <p className="font-extrabold text-slate-900 dark:text-white text-sm">{log.action}</p>
                              <p className="text-xs text-slate-400 mt-0.5">بواسطة: <span className="font-bold text-slate-600 dark:text-slate-300">{log.user}</span></p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-400">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'leaderboard' && userRole === 'MANAGER' && (
                <div className="flex flex-col gap-8">
                  <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-3"><Award className="size-7 text-amber-500" /> {t.leaderboardTitle}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">تقييم ومتابعة أداء المشرفين في معالجة الغرامات وتحصيل المستحقات</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: userName, role: userRole === 'MANAGER' ? 'مدير العمليات الأول' : 'مشرف العمليات', resolved: 42, recovered: '14,500 رس', rank: 'الأول 🥇' },
                      { name: 'مشرف فرع الرمان', role: 'مسؤول المتابعة', resolved: 28, recovered: '8,200 رس', rank: 'الثاني 🥈' },
                      { name: 'مشرف فرع النخيل', role: 'مسؤول العمليات', resolved: 19, recovered: '5,100 رس', rank: 'الثالث 🥉' }
                    ].map((leader, i) => (
                      <div key={i} className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>
                        <div className="flex items-center gap-4">
                          <div className="size-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow-lg">{leader.rank}</div>
                          <div>
                            <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">{leader.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{leader.role}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#060913] p-4 rounded-2xl border border-slate-100 dark:border-white/10 flex justify-between items-center">
                          <div>
                            <p className="text-xs text-slate-400 font-bold">المطالبات المعالجة</p>
                            <p className="font-extrabold text-slate-900 dark:text-white text-base mt-1">{leader.resolved} مطالبة</p>
                          </div>
                          <div className="text-right border-r border-slate-200 dark:border-white/10 pr-6">
                            <p className="text-xs text-slate-400 font-bold">المبلغ المحصل</p>
                            <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base mt-1">{leader.recovered}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'restaurants' && userRole === 'MANAGER' && (
                <div className="flex flex-col gap-8">
                  <div className="bg-white dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-3"><Store className="size-7 text-blue-600 dark:text-blue-400" /> {t.restaurantsGuide}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{t.restaurantsGuideDesc}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurantStats.length === 0 ? (
                       <div className="col-span-full flex justify-center py-20 text-slate-400 font-bold text-lg bg-white dark:bg-white/5 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">لا توجد بيانات للعرض</div>
                    ) : (
                      restaurantStats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-500/50 hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden flex flex-col gap-6">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 dark:from-blue-600/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="flex items-center gap-5 border-b border-slate-100 dark:border-white/10 pb-5 relative">
                            <div className="size-16 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner group-hover:scale-110 transition-transform"><Store className="size-7" /></div>
                            <div><h4 className="font-extrabold text-xl text-slate-900 dark:text-white">{stat.name}</h4><p className="text-sm font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1.5"><MapPin className="size-4 text-blue-500 dark:text-blue-400" /> {stat.branchesCount} {t.branchesCount}</p></div>
                          </div>
                          <div className="flex justify-between items-center bg-slate-50 dark:bg-[#060913] p-5 rounded-2xl border border-slate-100 dark:border-white/10 relative">
                            <div><p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">{t.totalFines}</p><p className="font-extrabold text-red-600 dark:text-red-400 text-lg">{stat.totalAmount.toLocaleString()} رس</p></div>
                            <div className="text-right border-r border-slate-200 dark:border-white/10 pr-6"><p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">{t.penaltiesCount}</p><p className="font-extrabold text-slate-900 dark:text-white text-lg">{stat.penaltyCount}</p></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="bg-white dark:bg-[#0a0f1d] w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-slate-200 dark:border-white/15">
              <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5"><h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.addNewPenalty}</h3><button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 p-2.5 rounded-2xl transition-colors"><X className="size-6" /></button></div>
              <form onSubmit={handleSubmitPenalty} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3"><label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.app}</label><select required className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" value={formData.app} onChange={e => setFormData({...formData, app: e.target.value})}><option value="" className="bg-white dark:bg-[#060913]">{t.selectApp}</option><option value="جاهز" className="bg-white dark:bg-[#060913]">جاهز</option><option value="هنقرستيشن" className="bg-white dark:bg-[#060913]">هنقرستيشن</option><option value="تويو" className="bg-white dark:bg-[#060913]">تويو</option><option value="ذا شيفز" className="bg-white dark:bg-[#060913]">ذا شيفز</option><option value="نينجا" className="bg-white dark:bg-[#060913]">نينجا</option></select></div>
                  <div className="space-y-3"><label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.restaurantName}</label><input type="text" required className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" value={formData.restaurantName} onChange={e => setFormData({...formData, restaurantName: e.target.value})} /></div>
                  <div className="space-y-3"><label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.brand}</label><input type="text" className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} /></div>
                  <div className="space-y-3"><label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.branch}</label><input type="text" required className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} /></div>
                  <div className="space-y-3"><label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.orderNumber}</label><input type="text" className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" value={formData.orderNumber} onChange={e => setFormData({...formData, orderNumber: e.target.value})} /></div>
                  <div className="space-y-3"><label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.amount}</label><input type="number" required min="0" step="0.01" className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div>
                  
                  {/* حالة المخالفة مغلقة ومثبتة قيد المراجعة افتراضياً لمنع التلاعب */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.status}</label>
                    <div className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-sm flex items-center font-bold text-amber-600 dark:text-amber-400 select-none">
                      {t.underReview} (يتم التحديث لاحقاً من المطالبات)
                    </div>
                  </div>
                  
                  <div className="space-y-3"><label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.reason}</label><input type="text" className="w-full h-12 px-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#060913] text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} /></div>
                </div>
                <div className="mt-10 flex justify-end gap-4 pt-8 border-t border-slate-100 dark:border-white/10">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-8 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-bold transition-colors">{t.cancel}</button>
                  <button type="submit" className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-xl transition-all hover:-translate-y-0.5 border border-white/20">{t.save}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toast && (
          <div className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-[110] flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-8 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle className="size-6" /> : <AlertCircle className="size-6" />}
            <p className="text-base font-bold">{toast.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
