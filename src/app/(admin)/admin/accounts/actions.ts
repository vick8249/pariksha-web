'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function promoteToAdmin(formData: FormData) {
  try {
    await requireAdmin()
    const email = formData.get('email') as string
    
    if (!email) {
      return { error: 'Email is required' }
    }

    const user = await db.user.findUnique({ where: { email } })
    
    if (!user) {
      return { error: 'No user found with this email. They must register first.' }
    }
    
    if (user.role === 'ADMIN') {
      return { error: 'User is already an Admin.' }
    }

    await db.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })

    revalidatePath('/admin/accounts')
    return { success: 'User has been promoted to Admin successfully.' }
  } catch (error: any) {
    return { error: error.message || 'Failed to promote user' }
  }
}
