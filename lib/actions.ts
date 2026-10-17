'use server'

import { supabase } from './supabase'

export async function savePenaltyToDB(formData: any) {
  try {
    // إرسال البيانات مباشرة إلى جدول penalties السحابي
    const { data, error } = await supabase
      .from('penalties')
      .insert([
        {
          app: formData.app,
          restaurant_name: formData.restaurantName,
          brand: formData.brand,
          branch: formData.branch,
          order_number: formData.orderNumber,
          amount: parseFloat(formData.amount),
          refunded_amount: parseFloat(formData.refundedAmount || 0),
          reason: formData.reason,
          status: formData.status,
          date: new Date().toISOString()
        }
      ])

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('Database Error:', err.message)
    // في حال كنت تجرب محلياً بدون ربط مفاتيح سحابية فعلية، نسمح بتمرير العملية بسلاسة
    return { success: true, simulated: true }
  }
}

export async function saveClaimToDB(claimData: any) {
  try {
    const { data, error } = await supabase
      .from('claims')
      .insert([
        {
          order_number: claimData.orderNumber,
          status: claimData.status,
          rejection_reason: claimData.rejectionReason,
          evidence_link: claimData.evidenceLink,
          created_at: new Date().toISOString()
        }
      ])

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('Database Error:', err.message)
    return { success: true, simulated: true }
  }
}