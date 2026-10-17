'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Dashboard } from '@/components/dashboard/dashboard'
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import type { Penalty, DataSource } from '@/lib/penalties'

export default function Page() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [rows, setRows] = useState<Penalty[]>([])
  const [source, setSource] = useState<DataSource>('supabase' as DataSource)

  useEffect(() => {
    // 1. فحص الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        fetchData()
      } else {
        setLoading(false)
      }
    })

    // 2. الاستماع لتغيرات الجلسة
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        fetchData()
      } else {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // جلب المخالفات مباشرة من جدول penalties في Supabase
      const { data, error } = await supabase
        .from('penalties')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('خطأ في جلب البيانات من Supabase:', error.message)
      }

      if (data && data.length > 0) {
        const formatted = data.map((item: any) => ({
          date: item.date || item.created_at,
          app: item.app,
          branch: item.branch,
          orderNumber: item.order_number,
          amount: Number(item.amount) || 0,
          reason: item.reason,
          status: item.status,
          restaurantName: item.restaurant_name,
          brand: item.brand
        }))
        setRows(formatted)
      } else {
        setRows([])
      }
    } catch (e) {
      console.error('حدث خطأ غير متوقع:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setIsLoggingIn(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setAuthError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.')
      setIsLoggingIn(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="size-10 animate-spin text-blue-500 mb-4" />
        <p className="text-sm font-bold text-slate-400">جاري التحقق من صلاحيات الدخول...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white" dir="rtl">
        <div className="w-full max-w-md bg-slate-900/90 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-2xl">
          <div className="text-center mb-8">
            <div className="size-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-500/25 mb-4">
              <ShieldCheck className="size-8" />
            </div>
            <h2 className="text-2xl font-black text-white">تسجيل الدخول للنظام</h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">لوحة إدارة ومتابعة غرامات ومطالبات التطبيقات</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
                {authError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full h-12 bg-slate-950 border border-white/10 rounded-xl px-4 pl-10 text-sm text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="size-4 text-slate-500 absolute left-3 top-4" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-12 bg-slate-950 border border-white/10 rounded-xl px-4 pl-10 text-sm text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="size-4 text-slate-500 absolute left-3 top-4" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 border border-white/20 disabled:opacity-50 mt-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>جاري الدخول...</span>
                </>
              ) : (
                <>
                  <span>دخول للنظام</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <Dashboard 
      rows={rows} 
      source={source} 
      initialRole={session?.user?.user_metadata?.role || 'SUPERVISOR'} 
      userName={session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || 'مشرف الفرع'}
    />
  )
}
