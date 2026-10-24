'use client'

import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/dashboard/dashboard'
import { supabase } from '@/lib/supabase'
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, Truck } from 'lucide-react'

export default function Page() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [rows, setRows] = useState<any[]>([])
  const [userRole, setUserRole] = useState<'MANAGER' | 'SUPERVISOR'>('MANAGER')
  const [userName, setUserName] = useState('أحمد جمال')
  const [assignedRestaurant, setAssignedRestaurant] = useState('')

  // التحقق من حالة تسجيل الدخول الحالية في Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        setUserName(session.user.user_metadata?.name || 'أحمد جمال')
        setUserRole(session.user.user_metadata?.role || 'MANAGER')
        setAssignedRestaurant(session.user.user_metadata?.restaurant || '')
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        setUserName(session.user.user_metadata?.name || 'أحمد جمال')
        setUserRole(session.user.user_metadata?.role || 'MANAGER')
        setAssignedRestaurant(session.user.user_metadata?.restaurant || '')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // جلب المخالفات من Supabase عند نجاح الدخول
  useEffect(() => {
    if (session) {
      async function fetchPenalties() {
        const { data } = await supabase
          .from('penalties')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (data) setRows(data)
      }
      fetchPenalties()
    }
  }, [session])

  // دالة تسجيل الدخول عبر Supabase Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setErrorMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage('خطأ في البريد الإلكتروني أو كلمة المرور. تأكد من البيانات وصلاحيتها.')
      setAuthLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // إذا لم يتم تسجيل الدخول، اعرض شاشة تسجيل الدخول الاحترافية
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans p-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="size-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4">
              <Truck className="size-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">إدارة المطالبات والغرامات</h1>
            <p className="text-xs text-slate-400 mt-1">سجل الدخول للمتابعة إلى لوحة التحكم التشغيلية</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-3.5 size-5 text-slate-500" />
                <input 
                  type="email" 
                  required 
                  placeholder="name@foodizone.com"
                  className="w-full h-12 pr-12 pl-4 rounded-2xl border border-white/10 bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-3.5 size-5 text-slate-500" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full h-12 pr-12 pl-4 rounded-2xl border border-white/10 bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full h-12 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-sm border border-white/20"
            >
              {authLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <span>تسجيل الدخول للنظام</span>
                  <ArrowRight className="size-4 rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // إذا تم تسجيل الدخول بنجاح، اعرض الداشبورد الكاملة مع بيانات الحساب النشط
  return (
    <Dashboard 
      rows={rows} 
      source="SUPABASE" 
      initialRole={userRole} 
      userName={userName} 
      assignedRestaurant={assignedRestaurant} 
    />
  )
}
