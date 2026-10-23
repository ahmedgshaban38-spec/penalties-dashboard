import { Dashboard } from '@/components/dashboard/dashboard'
import { supabase } from '@/lib/supabase'

export default async function Page() {
  // جلب البيانات مباشرة من Supabase لتعمل الداشبورد بكل قوة
  const { data: rows } = await supabase
    .from('penalties')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <Dashboard 
      rows={rows || []} 
      source="SUPABASE" 
      initialRole="MANAGER" 
      userName="أحمد جمال" 
      assignedRestaurant="" 
    />
  )
}
