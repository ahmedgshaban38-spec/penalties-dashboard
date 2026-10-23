'use client'

import { Dashboard } from '@/components/dashboard/dashboard'

export default function Page() {
  // بيانات افتراضية للتشغيل الفوري للداشبورد بكامل الصلاحيات والراحة
  const sampleRows = [
    {
      date: new Date().toISOString(),
      app: 'هنقرستيشن',
      restaurantName: 'مطعم الرمان',
      brand: 'براند الرمان',
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
      rows={sampleRows} 
      source="SUPABASE" 
      initialRole="MANAGER" 
      userName="أحمد جمال" 
      assignedRestaurant="" 
    />
  )
}
