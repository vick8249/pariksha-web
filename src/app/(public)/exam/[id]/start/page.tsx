import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import ExamInterface from '@/components/exam/ExamInterface'
import { cookies } from 'next/headers'
import { translateQuestion, type Language } from '@/lib/i18n'

export default async function ExamStartPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ resume?: string }>
}) {
  const { id } = await params
  const { resume } = await searchParams
  const session = await requireAuth()

  const exam = await db.exam.findUnique({
    where: { id, isPublished: true },
    include: {
      questions: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!exam) notFound()
  if (exam.questions.length === 0) {
    redirect(`/exam/${id}`)
  }

  // Shuffle questions if enabled
  const rawQuestions = exam.shuffleQuestions
    ? [...exam.questions].sort(() => Math.random() - 0.5)
    : exam.questions

  // Translate questions based on user's language preference
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value || 'en') as Language
  const questions = rawQuestions.map(q => translateQuestion(q, lang))

  // Find or create attempt
  let attempt
  let savedAnswers: Record<string, string> = {}

  if (resume) {
    // Resume existing in-progress attempt
    attempt = await db.attempt.findFirst({
      where: { id: resume, userId: session.userId, examId: id, status: 'IN_PROGRESS' },
      include: { answers: true },
    })
    if (attempt) {
      savedAnswers = Object.fromEntries(
        attempt.answers
          .filter((a) => a.selectedOption !== null)
          .map((a) => [a.questionId, a.selectedOption as string])
      )
    }
  }

  if (!attempt) {
    // Abandon any stale in-progress attempts for this exam before creating a fresh one
    await db.attempt.updateMany({
      where: { userId: session.userId, examId: id, status: 'IN_PROGRESS' },
      data: { status: 'ABANDONED' }
    })

    // Create new attempt
    attempt = await db.attempt.create({
      data: {
        userId: session.userId,
        examId: id,
        totalMarks: exam.totalMarks,
        status: 'IN_PROGRESS',
      },
    })
  }

  // Calculate remaining time
  const elapsedSeconds = Math.floor(
    (Date.now() - new Date(attempt.startedAt).getTime()) / 1000
  )
  const remainingSeconds = Math.max(exam.duration * 60 - elapsedSeconds, 0)

  // If time already ran out, redirect to submit
  if (remainingSeconds <= 0) {
    redirect(`/exam/${id}/result/${attempt.id}`)
  }

  return (
    <ExamInterface
      attemptId={attempt.id}
      examId={id}
      examTitle={exam.title}
      questions={questions}
      durationSeconds={remainingSeconds}
      negativeMarking={exam.negativeMarking}
      negativeFactor={exam.negativeFactor}
      savedAnswers={savedAnswers}
    />
  )
}
