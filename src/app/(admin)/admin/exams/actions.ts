'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const ExamSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional(),
  subjectId: z.string().min(1, 'Subject is required'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 min'),
  passingScore: z.coerce.number().min(1).max(100).default(60),
  negativeMarking: z.boolean().default(false),
  negativeFactor: z.coerce.number().default(0.25),
  shuffleQuestions: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  instructions: z.string().optional(),
  isPremium: z.boolean().default(false),
  entryFee: z.coerce.number().optional(),
  prizePool: z.coerce.number().optional(),
  tournamentRules: z.string().optional(),
  isDaily: z.boolean().default(false),
  scheduledDate: z.coerce.date().optional(),
})

export async function createExam(formData: FormData) {
  await requireAdmin()
  const data = ExamSchema.parse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    subjectId: formData.get('subjectId'),
    duration: formData.get('duration'),
    passingScore: formData.get('passingScore'),
    negativeMarking: formData.get('negativeMarking') === 'on',
    negativeFactor: formData.get('negativeFactor') || 0.25,
    shuffleQuestions: formData.get('shuffleQuestions') === 'on',
    isPublished: formData.get('isPublished') === 'on',
    instructions: formData.get('instructions') || undefined,
    isPremium: formData.get('isPremium') === 'on',
    entryFee: formData.get('entryFee') || undefined,
    prizePool: formData.get('prizePool') || undefined,
    tournamentRules: formData.get('tournamentRules') || undefined,
    isDaily: formData.get('isDaily') === 'on',
    scheduledDate: formData.get('scheduledDate') || undefined,
  })

  // Start with 0 marks, questions will add to it
  const exam = await db.exam.create({ data: { ...data, totalMarks: 0 } })
  
  if (exam.isPremium) {
    revalidatePath('/admin/scholarships')
    redirect('/admin/scholarships')
  } else {
    revalidatePath('/admin/exams')
    redirect('/admin/exams')
  }
}

export async function updateExam(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const data = ExamSchema.parse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    subjectId: formData.get('subjectId'),
    duration: formData.get('duration'),
    passingScore: formData.get('passingScore'),
    negativeMarking: formData.get('negativeMarking') === 'on',
    negativeFactor: formData.get('negativeFactor') || 0.25,
    shuffleQuestions: formData.get('shuffleQuestions') === 'on',
    isPublished: formData.get('isPublished') === 'on',
    instructions: formData.get('instructions') || undefined,
    isPremium: formData.get('isPremium') === 'on',
    entryFee: formData.get('entryFee') || undefined,
    prizePool: formData.get('prizePool') || undefined,
    tournamentRules: formData.get('tournamentRules') || undefined,
    isDaily: formData.get('isDaily') === 'on',
    scheduledDate: formData.get('scheduledDate') || undefined,
  })

  const exam = await db.exam.update({ where: { id }, data })
  
  if (exam.isPremium) {
    revalidatePath('/admin/scholarships')
    redirect('/admin/scholarships')
  } else {
    revalidatePath('/admin/exams')
    redirect('/admin/exams')
  }
}

export async function deleteExam(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  await db.exam.delete({ where: { id } })
  revalidatePath('/admin/exams')
}
