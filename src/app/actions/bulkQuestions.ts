'use server'

import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

type QuestionInput = {
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
  explanation?: string
  marks?: number
}

export async function bulkCreateQuestions(examId: string, questionsData: QuestionInput[]) {
  try {
    await requireAdmin()

    // 1. Get the current highest order for this exam
    const lastQuestion = await db.question.findFirst({
      where: { examId },
      orderBy: { order: 'desc' },
      select: { order: true }
    })
    let currentOrder = (lastQuestion?.order ?? 0)

    let totalMarksToAdd = 0

    const questionsToInsert = questionsData.map(q => {
      currentOrder++
      totalMarksToAdd += (q.marks || 1)
      return {
        examId,
        text: q.text,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption as 'A' | 'B' | 'C' | 'D',
        explanation: q.explanation || null,
        marks: q.marks || 1,
        order: currentOrder
      }
    })

    // 2. Insert all and update exam in a transaction
    await db.$transaction([
      db.question.createMany({ data: questionsToInsert }),
      db.exam.update({
        where: { id: examId },
        data: { totalMarks: { increment: totalMarksToAdd } }
      })
    ])

    revalidatePath(`/admin/exams/${examId}/questions`)
    return { success: true }
  } catch (error: unknown) {
    console.error('Bulk upload error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to upload questions' }
  }
}

