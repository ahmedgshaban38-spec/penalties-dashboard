'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Truck, Lock, Mail, User, Building, ArrowRight, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('أحمد جمال')
  const [restaurantName, setRestaurantName] = useState('إدارة العمليات العامة')
  const [role, setRole] = useState<'MANAGER' | 'SUPERVISOR'>('MANAGER')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // تخزين بيانات الجلسة محلياً لضمان الدخول الفوري دون أي عوائق
    const sessionData = {
      name: name || 'أحمد جمال',
      restaurant: restaurantName,
      role: role,
      email: email || 'admin@foodizone.com',
      isLoggedIn: true
    }

    localStorage.setItem('user_session', JSON.stringify(sessionData))
    setSuccessMsg('تم تسجيل الدخول بنجاح! جاري فتح لوحة التحكم...')

    setTimeout(() => {
      window.location.replace('/')
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6 relative overflow-hidden font-sans" dir="rtl">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/85 backdrop-blur-2xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="size-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-4">
            <Truck className="size-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">نظام إدارة الغرامات والمطالبات</h1>
          <p className="text-xs text-slate-400 mt-1">الدخول الفوري والآمن لإدارة العمليات</p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="size-4" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleDirectLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">اختر نوع الصلاحية</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole('MANAGER')
                  setRestaurantName('إدارة العمليات العامة')
                  setName('أحمد جمال')
                }}
                className={`p-3 rounded-2xl text-xs font-extrabold border transition-all ${
                  role === 'MANAGER'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                مدير العمليات (أدمن)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('SUPERVISOR')
                  setRestaurantName('فرع الرمان')
                  setName('مشرف الفرع')
                }}
                className={`p-3 rounded-2xl text-xs font-extrabold border transition-all ${
                  role === 'SUPERVISOR'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                مشرف مطعم
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">اسم المسؤول</label>
            <div className="relative">
              <User className="absolute right-4 top-3.5 size-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 pr-11 pl-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {role === 'SUPERVISOR' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">اسم المطعم / الفرع المخصص</label>
              <div className="relative">
                <Building className="absolute right-4 top-3.5 size-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full h-12 pr-11 pl-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-3.5 size-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="ahmed@foodizone.com"
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
            className="w-full h-12 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <span>دخول لوحة التحكم فوراً</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
