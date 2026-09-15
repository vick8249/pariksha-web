'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function resetStudentPassword(userId: string) {
  // Ensure the caller is an admin
  await requireAdmin()
  
  // Generate a standard temporary password
  const tempPassword = 'Pariksha@2026'
  const hashedPassword = await bcrypt.hash(tempPassword, 12)
  
  // Update the user only if they are a student
  const updatedUser = await db.user.update({
    where: { id: userId, role: 'STUDENT' },
    data: { password: hashedPassword }
  })
  
  revalidatePath('/admin/students')
  return { success: true, tempPassword }
}

export async function deleteStudent(userId: string) {
  await requireAdmin()
  
  await db.user.delete({
    where: { id: userId, role: 'STUDENT' }
  })
  
  revalidatePath('/admin/students')
}
