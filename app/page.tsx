'use client'

import { Dashboard } from '@/components/dashboard/dashboard'

export default function Page() {
  // جلب البيانات الأساسية للعمليات لضمان فتح الداشبورد بكامل الصلاحيات والراحة
  const initialRows = [
    {
      date: new Date().toISOString(),
      app: 'هنقرستيشن',
      restaurantName: 'مطعم الرمان',
      brand: 'البراند',
      branch: 'فرع الرئيسي',
      orderNumber: '8492041',
      orderStatus: 'تم التوصيل',
      amount: 150,
      reason: 'تأخير استلام الطلب',
      status: 'قيد المراجعة',
      rejectionReason: '',
      evidenceLink: ''
    }
  ]

  return (
    <Dashboard 
      rows={initialRows} 
      source="SUPABASE" 
      initialRole="MANAGER" 
      userName="أحمد جمال" 
      assignedRestaurant="" 
    />
  )
}
