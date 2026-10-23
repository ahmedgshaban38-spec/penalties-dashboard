'use client'

import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/dashboard/dashboard'
import { supabase } from '@/lib/supabase'

export default function Page() {
  const [rows, setRows] = useState<any[]>([])
  const [userRole, setUserRole] = useState<'MANAGER' | 'SUPERVISOR'>('MANAGER')
  const [userName, setUserName] = useState('أحمد جمال')
  const [assignedRestaurant, setAssignedRestaurant] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  useEffect(() => {
    // جلب البيانات من سحابة Supabase فوراً
    async function fetchData() {
      const { data } = await supabase
        .from('penalties')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setRows(data)
    }
    fetchData()
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* شريط علوي مؤقت للتحكم السريع في الصلاحيات لضمان عدم تعطل عملك */}
      <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-xs z-50 relative border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="font-bold text-emerald-400">● النظام يعمل بالوضع المباشر</span>
          <span>المستخدم: <strong>{userName}</strong> ({userRole === 'MANAGER' ? 'مدير العمليات (أدمن)' : 'مشرف مطعم'})</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setUserRole('MANAGER'); setAssignedRestaurant(''); setUserName('أحمد جمال'); }}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${userRole === 'MANAGER' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            وضع الآدمن (كل المطاعم)
          </button>
          <button 
            onClick={() => { setUserRole('SUPERVISOR'); setAssignedRestaurant('مطعم الرمان'); setUserName('مشرف فرع الرمان'); }}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${userRole === 'SUPERVISOR' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'}`}
          >
            وضع مشرف مطعم (عزل البيانات)
          </button>
        </div>
      </div>

      <Dashboard 
        rows={rows} 
        source="SUPABASE" 
        initialRole={userRole} 
        userName={userName} 
        assignedRestaurant={assignedRestaurant} 
      />
    </div>
  )
}
