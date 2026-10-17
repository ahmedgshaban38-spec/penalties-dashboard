'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { AlertCircle, Database, Truck, LayoutDashboard, AlertTriangle, FileText, Store, LogOut, Plus, Download, Printer, X, Globe, Link as LinkIcon, MapPin, CheckCircle, Moon, Sun, ShieldCheck, TrendingUp, ArrowUpRight, Bell, Filter, Clock, Shield, Sparkles, History, FileDown, Award, Users, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import type { DataSource, Penalty } from '@/lib/penalties'
import { supabase } from '@/lib/supabase'
import { BranchFilter, ALL_RESTAURANTS } from './branch-filter'
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
  
  // الفلترة العلوية الآن تكون باسم المطعم
  const [selectedRestaurant, setSelectedRestaurant] = useState(ALL_RESTAURANTS)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  const [toast, setToast] = useState<{message: string, type: 'success'|'error', id: number} | null>(null)
  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    const id = Date.now()
    setToast({ message, type, id })
    setTimeout(() => setToast(current => current?.id === id ? null : current), 3500)
  }
  
  // نموذج إدخال المخالفة مثبت الحالة افتراضياً على (قيد المراجعة)
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

  // نموذج المطالبة
  const [claimData, setClaimData] = useState({ 
    orderNumber: '', 
    status: t.refunded, 
    rejectionReason: '', 
    evidenceLink: '' 
  })

  // استخراج قائمة أسماء المطاعم المتاحة بدون تكرار
  const restaurantsList = useMemo(() => {
    const names = rows
      .map((r) => ((r as any).restaurantName || (r as any).brand || r.branch || '').trim())
      .filter(Boolean)
    return [...new Set(names)].sort((a, b) => a.localeCompare(b, lang === 'ar' ? 'ar' : 'en'))
  }, [rows, lang])
  
  // تصفية البيانات وفق المطعم المختار
  const filteredByRestaurant = useMemo(() => {
    if (selectedRestaurant === ALL_RESTAURANTS || selectedRestaurant === 'جميع الفروع والمطاعم') return rows
    return rows.filter((r) => {
      const rest = ((r as any).restaurantName || '').trim()
      const brand = ((r as any).brand || '').trim()
      const branch = (r.branch || '').trim()
      return rest === selectedRestaurant || brand === selectedRestaurant || branch === selectedRestaurant
    })
  }, [rows, selectedRestaurant])

  const filtered = useMemo(() => {
    const list = filteredByRestaurant.map(r => ({
      ...r,
      date: r.date ? new Date(r.date).toISOString().split('T')[0] : r.date
    }))
    if (statusFilter === 'ALL') return list
    if (statusFilter === 'REVIEW
