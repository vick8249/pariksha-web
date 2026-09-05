'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

const SubjectSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  nameHi: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
})

export async function createSubject(formData: FormData) {
  await requireAdmin()
  const data = SubjectSchema.parse({
    name: formData.get('name'),
    nameHi: formData.get('nameHi') || undefined,
    categoryId: formData.get('categoryId'),
    order: formData.get('order'),
    isActive: formData.get('isActive') === 'on',
  })
  
  const slug = slugify(data.name)
  await db.subject.create({ data: { ...data, slug } })
  
  revalidatePath('/admin/subjects')
  redirect('/admin/subjects')
}

export async function updateSubject(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const data = SubjectSchema.parse({
    name: formData.get('name'),
    nameHi: formData.get('nameHi') || undefined,
    categoryId: formData.get('categoryId'),
    order: formData.get('order'),
    isActive: formData.get('isActive') === 'on',
  })
  
  const slug = slugify(data.name)
  await db.subject.update({ where: { id }, data: { ...data, slug } })
  
  revalidatePath('/admin/subjects')
  redirect('/admin/subjects')
}

export async function deleteSubject(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  await db.subject.delete({ where: { id } })
  revalidatePath('/admin/subjects')
}
