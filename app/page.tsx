'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Truck, Lock, Mail, User, Building, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')

    try {
      if (isSignUp) {
        // 1. إنشاء الحساب مع تفعيل الحساب وتجاوز قيود التفعيل اليدوي
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || 'مدير المطعم',
              restaurant: restaurantName,
              role: 'SUPERVISOR'
            }
          }
        })

        if (signUpError) throw signUpError

        // 2. حفظ المطعم في جدول المطاعم العام
        if (restaurantName) {
          await supabase.from('restaurants').upsert([
            {
              name: restaurantName,
              owner_name: name,
              owner_email: email,
            }
          ], { onConflict: 'name' })
        }

        setSuccessMsg('تم إنشاء الحساب وتسجيل الدخول بنجاح!')
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)

      } else {
        // 3. تسجيل الدخول المباشر
        const { data, error: signInError } + await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError

        setSuccessMsg('تم تسجيل الدخول بنجاح! جاري التوجيه...')
        setTimeout(() => {
          window.location.href = '/'
        }, 800)
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في البريد الإلكتروني أو كلمة المرور. يرجى التحقق والتجربة مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6 relative overflow-hidden font-sans" dir="rtl">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="size-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-4">
            <Truck className="size-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">نظام إدارة الغرامات والمطالبات</h1>
          <p className="text-xs text-slate-400 mt-1">منصة التشغيل الذكي لإدارة مطاعم ومستحقات التوصيل</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="size-4" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">اسم المسؤول / المشرف</label>
                <div className="relative">
                  <User className="absolute right-4 top-3.5 size-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="أحمد جمال"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 pr-11 pl-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">اسم المطعم / البراند الرئيسي</label>
                <div className="relative">
                  <Building className="absolute right-4 top-3.5 size-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="مطعم برجر كنج / فرع الرمان"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full h-12 pr-11 pl-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-3.5 size-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pr-11 pl-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-3.5 size-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pr-11 pl-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'إنشاء حساب المطعم والبدء' : 'تسجيل الدخول'}</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setSuccessMsg('')
            }}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'صاحب مطعم جديد؟ أنشئ حساب مطعمك الآن'}
          </button>
        </div>
      </div>
    </div>
  )
}
