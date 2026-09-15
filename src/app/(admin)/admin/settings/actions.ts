'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function changeAdminPassword(formData: FormData) {
  const session = await requireAdmin()
  
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!newPassword || newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters long.' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12)
  
  await db.user.update({
    where: { id: session.userId },
    data: { password: hashedPassword }
  })

  return { success: true }
}
