'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  nameHi: z.string().optional(),
  description: z.string().optional(),
  iconUrl: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(['CLASS', 'COMPETITIVE', 'LANGUAGE', 'CUSTOM']),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
})

export async function createCategory(formData: FormData) {
  await requireAdmin()
  const data = CategorySchema.parse({
    name: formData.get('name'),
    nameHi: formData.get('nameHi') || undefined,
    description: formData.get('description') || undefined,
    iconUrl: formData.get('iconUrl') || undefined,
    color: formData.get('color') || undefined,
    type: formData.get('type'),
    order: formData.get('order'),
    isActive: formData.get('isActive') === 'on',
  })
  const slug = slugify(data.name)
  await db.category.create({ data: { ...data, slug } })
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function updateCategory(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const data = CategorySchema.parse({
    name: formData.get('name'),
    nameHi: formData.get('nameHi') || undefined,
    description: formData.get('description') || undefined,
    iconUrl: formData.get('iconUrl') || undefined,
    color: formData.get('color') || undefined,
    type: formData.get('type'),
    order: formData.get('order'),
    isActive: formData.get('isActive') === 'on',
  })
  const slug = slugify(data.name)
  await db.category.update({ where: { id }, data: { ...data, slug } })
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  await db.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
}
