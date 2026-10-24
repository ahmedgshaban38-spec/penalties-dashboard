'use client'

import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/dashboard/dashboard'
import { supabase } from '@/lib/supabase'
import { Lock, Mail, Loader2, ArrowRight, Truck, User, Building, Phone } from 'lucide-react'

export default function Page() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [isSignUp, setIsSignUp] = useState(false) // للتبديل بين تسجيل الدخول وإنشاء حساب

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [phone, setPhone] = useState('')

  const [authLoading, setAuthLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [rows, setRows] = useState<any[]>([])
  const [userRole, setUserRole] = useState<'MANAGER' | 'SUPERVISOR'>('MANAGER')
  const [userName, setUserName] = useState('أحمد جمال')
  const [assignedRestaurant, setAssignedRestaurant] = useState('')

  // التحقق من الجلسة النشطة
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

  // جلب المخالفات عند نجاح الدخول
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

  // دالة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setErrorMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage('خطأ في البريد الإلكتروني أو كلمة المرور.')
      setAuthLoading(false)
    }
  }

  // دالة إنشاء حساب مطعم جديد (Self-Service Signup)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    if (!restaurantName.trim()) {
      setErrorMessage('يرجى إدخال اسم المطعم أو البراند.')
      setAuthLoading(false)
      return
    }

    // 1. إنشاء الحساب في Supabase Auth مع تخزين بيانات المطعم في الـ Metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName || 'مسؤول المطعم',
          role: 'SUPERVISOR', // مشرف خاص بمطعمه فقط
          restaurant: restaurantName.trim(),
          phone: phone
        }
      }
    })

    if (error) {
      setErrorMessage(`خطأ في التسجيل: ${error.message}`)
      setAuthLoading(false)
      return
    }

    // 2. تسجيل المطعم في جدول restaurants العام للتتبع
    await supabase.from('restaurants').insert([{
      name: restaurantName.trim(),
      owner_name: fullName,
      owner_email: email,
      phone: phone
    }]).select()

    setSuccessMessage('تم إنشاء حساب المطعم بنجاح! جاري تسجيل الدخول...')
    setAuthLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // إذا لم يتم تسجيل الدخول، اعرض شاشة الدخول والتسجيل
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans p-4 relative overflow-hidden" dir="rtl">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="size-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4">
              <Truck className="size-8" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">نظام إدارة المطالبات</h1>
            <p className="text-xs text-slate-400 mt-1">
              {isSignUp ? 'سجل مطعمك الجديد وابدأ بإدارة غراماتك' : 'سجل الدخول للمتابعة إلى لوحة التحكم'}
            </p>
          </div>

          {/* أزرار التبديل بين تسجيل الدخول وإنشاء حساب */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl mb-6 border border-white/10">
            <button 
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMessage(''); setSuccessMessage(''); }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all ${!isSignUp ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              تسجيل الدخول
            </button>
            <button 
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMessage(''); setSuccessMessage(''); }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all ${isSignUp ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              تسجيل مطعم جديد
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
              {successMessage}
            </div>
          )}

          {/* نموذج تسجيل الدخول أو إنشاء الحساب */}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">اسم المطعم أو البراند <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building className="absolute right-4 top-3.5 size-5 text-slate-500" />
                    <input 
                      type="text" 
                      required 
                      placeholder="مثال: مطعم الرمان"
                      className="w-full h-11 pr-12 pl-4 rounded-2xl border border-white/10 bg-slate-950 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-white font-medium"
                      value={restaurantName}
                      onChange={e => setRestaurantName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">اسم المسؤول</label>
                  <div className="relative">
                    <User className="absolute right-4 top-3.5 size-5 text-slate-500" />
                    <input 
                      type="text" 
                      required 
                      placeholder="أحمد جمال"
                      className="w-full h-11 pr-12 pl-4 rounded-2xl border border-white/10 bg-slate-950 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-white font-medium"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-3.5 size-5 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="0500000000"
                      className="w-full h-11 pr-12 pl-4 rounded-2xl border border-white/10 bg-slate-950 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-white font-medium font-mono"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-3.5 size-5 text-slate-500" />
                <input 
                  type="email" 
                  required 
                  placeholder="name@restaurant.com"
                  className="w-full h-11 pr-12 pl-4 rounded-2xl border border-white/10 bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-3.5 size-5 text-slate-500" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="w-full h-11 pr-12 pl-4 rounded-2xl border border-white/10 bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={authLoading}
              className={`w-full h-12 mt-4 text-white font-extrabold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-sm border border-white/20 ${
                isSignUp 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/25' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25'
              }`}
            >
              {authLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'إنشاء حساب المطعم الآن' : 'تسجيل الدخول للنظام'}</span>
                  <ArrowRight className="size-4 rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // العرض عند تسجيل الدخول بنجاح مع تطبيق عزل البيانات التام
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
