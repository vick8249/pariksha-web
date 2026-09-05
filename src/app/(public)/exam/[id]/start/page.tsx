import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import ExamInterface from '@/components/exam/ExamInterface'

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
        select: {
          id: true, text: true, imageUrl: true,
          optionA: true, optionB: true, optionC: true, optionD: true,
          marks: true,
        },
      },
    },
  })

  if (!exam) notFound()
  if (exam.questions.length === 0) {
    redirect(`/exam/${id}`)
  }

  // Shuffle questions if enabled
  const questions = exam.shuffleQuestions
    ? [...exam.questions].sort(() => Math.random() - 0.5)
    : exam.questions

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
