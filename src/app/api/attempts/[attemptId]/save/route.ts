import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'

// POST /api/attempts/[attemptId]/save
// Auto-saves answers during an exam (called every 15 seconds)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { attemptId } = await params
    const { answers } = await req.json() as { answers: Record<string, string> }

    // Verify this attempt belongs to the current user
    const attempt = await db.attempt.findFirst({
      where: { id: attemptId, userId: session.userId, status: 'IN_PROGRESS' },
    })
    if (!attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })

    // Upsert each answer
    await Promise.all(
      Object.entries(answers).map(([questionId, selectedOption]) =>
        db.attemptAnswer.upsert({
          where: { attemptId_questionId: { attemptId, questionId } },
          update: { selectedOption: selectedOption as 'A' | 'B' | 'C' | 'D' },
          create: {
            attemptId,
            questionId,
            selectedOption: selectedOption as 'A' | 'B' | 'C' | 'D',
          },
        })
      )
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Auto-save error:', error)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
