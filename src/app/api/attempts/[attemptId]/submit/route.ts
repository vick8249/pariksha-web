import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

// POST /api/attempts/[attemptId]/submit
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { attemptId } = await params
    const { answers } = await req.json() as { answers: Record<string, string> }

    // Verify attempt
    const attempt = await db.attempt.findFirst({
      where: { id: attemptId, userId: session.userId, status: 'IN_PROGRESS' },
      include: {
        exam: {
          include: {
            questions: {
              select: { id: true, correctOption: true, marks: true },
            },
          },
        },
      },
    })

    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })

    const exam = attempt.exam
    const timeTaken = Math.floor(
      (Date.now() - new Date(attempt.startedAt).getTime()) / 1000
    )

    // Score calculation
    let score = 0
    const answerRecords = []

    for (const question of exam.questions) {
      const selected = answers[question.id] as 'A' | 'B' | 'C' | 'D' | undefined
      const isCorrect = selected === question.correctOption
      let marksAwarded = 0

      if (selected) {
        if (isCorrect) {
          marksAwarded = question.marks
        } else if (exam.negativeMarking) {
          marksAwarded = -(question.marks * exam.negativeFactor)
        }
      }

      score += marksAwarded
      answerRecords.push({
        attemptId,
        questionId: question.id,
        selectedOption: selected ?? null,
        isCorrect,
        marksAwarded,
      })
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score)
    const percentage = attempt.totalMarks > 0 ? (score / attempt.totalMarks) * 100 : 0

    // Upsert all answers + mark attempt as completed
    await db.$transaction([
      ...answerRecords.map((ar) =>
        db.attemptAnswer.upsert({
          where: { attemptId_questionId: { attemptId: ar.attemptId, questionId: ar.questionId } },
          update: {
            selectedOption: ar.selectedOption as 'A' | 'B' | 'C' | 'D' | null,
            isCorrect: ar.isCorrect,
            marksAwarded: ar.marksAwarded,
          },
          create: {
            attemptId: ar.attemptId,
            questionId: ar.questionId,
            selectedOption: ar.selectedOption as 'A' | 'B' | 'C' | 'D' | null,
            isCorrect: ar.isCorrect,
            marksAwarded: ar.marksAwarded,
          },
        })
      ),
      db.attempt.update({
        where: { id: attemptId },
        data: {
          status: 'COMPLETED',
          submittedAt: new Date(),
          score,
          percentage,
          timeTaken,
        },
      }),
    ])

    return NextResponse.json({ ok: true, score, percentage })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 })
  }
}
