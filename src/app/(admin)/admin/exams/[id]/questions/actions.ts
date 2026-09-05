'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const QuestionSchema = z.object({
  examId: z.string().min(1),
  text: z.string().min(1, 'Question text is required').trim(),
  imageUrl: z.string().optional(),
  optionA: z.string().min(1, 'Option A is required').trim(),
  optionB: z.string().min(1, 'Option B is required').trim(),
  optionC: z.string().min(1, 'Option C is required').trim(),
  optionD: z.string().min(1, 'Option D is required').trim(),
  correctOption: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().optional(),
  marks: z.coerce.number().min(1).default(1),
})

export async function createQuestion(formData: FormData) {
  await requireAdmin()
  
  const data = QuestionSchema.parse({
    examId: formData.get('examId'),
    text: formData.get('text'),
    imageUrl: formData.get('imageUrl') || undefined,
    optionA: formData.get('optionA'),
    optionB: formData.get('optionB'),
    optionC: formData.get('optionC'),
    optionD: formData.get('optionD'),
    correctOption: formData.get('correctOption'),
    explanation: formData.get('explanation') || undefined,
    marks: formData.get('marks'),
  })

  // 1. Calculate the next order number automatically
  const lastQuestion = await db.question.findFirst({
    where: { examId: data.examId },
    orderBy: { order: 'desc' },
    select: { order: true }
  })
  const nextOrder = (lastQuestion?.order ?? 0) + 1

  // 2. Create the question and update exam total marks in a transaction
  await db.$transaction([
    db.question.create({
      data: {
        ...data,
        order: nextOrder,
      }
    }),
    db.exam.update({
      where: { id: data.examId },
      data: {
        totalMarks: { increment: data.marks }
      }
    })
  ])
  
  const returnUrl = `/admin/exams/${data.examId}/questions`
  revalidatePath(returnUrl)
  redirect(returnUrl)
}

export async function deleteQuestion(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  
  const question = await db.question.findUnique({ where: { id } })
  if (!question) return
  
  await db.$transaction([
    db.question.delete({ where: { id } }),
    db.exam.update({
      where: { id: question.examId },
      data: { totalMarks: { decrement: question.marks } }
    })
  ])
  
  revalidatePath(`/admin/exams/${question.examId}/questions`)
}
