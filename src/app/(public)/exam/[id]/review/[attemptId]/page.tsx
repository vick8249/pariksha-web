import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import { CheckCircle, XCircle, MinusCircle, ChevronLeft, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

import { cookies } from 'next/headers'
import { translateQuestion, type Language } from '@/lib/i18n'

export const metadata = { title: 'Review Answers' }

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>
}) {
  const { id, attemptId } = await params
  const session = await requireAuth()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value || 'en') as Language

  const attempt = await db.attempt.findFirst({
    where: { id: attemptId, userId: session.userId, status: 'COMPLETED' },
    include: {
      exam: { select: { title: true } },
      answers: {
        include: {
          question: true,
        },
        orderBy: { question: { order: 'asc' } },
      },
    },
  })

  if (!attempt) notFound()

  const OPTION_LABELS = { A: 'optionA', B: 'optionB', C: 'optionC', D: 'optionD' } as const

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/exam/${id}/result/${attemptId}`}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Result
          </Link>
          <h1 className="font-extrabold text-gray-900 text-xl">Review: {attempt.exam.title}</h1>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs mb-6">
          <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Correct
          </span>
          <span className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5" /> Wrong
          </span>
          <span className="flex items-center gap-1.5 text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
            <MinusCircle className="w-3.5 h-3.5" /> Skipped
          </span>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {attempt.answers.map((ans, idx) => {
            const q = translateQuestion(ans.question, lang)
            const isCorrect = ans.isCorrect
            const isSkipped = ans.selectedOption === null
            const statusColor = isSkipped
              ? 'border-gray-200'
              : isCorrect
              ? 'border-emerald-300'
              : 'border-red-300'

            return (
              <div key={ans.id} className={cn('bg-white rounded-2xl border-2 p-6', statusColor)}>
                {/* Q header */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400">Q{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {isSkipped ? (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MinusCircle className="w-4 h-4" /> Skipped
                      </span>
                    ) : isCorrect ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                        <CheckCircle className="w-4 h-4" /> +{ans.marksAwarded} mark{ans.marksAwarded !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                        <XCircle className="w-4 h-4" /> {ans.marksAwarded} marks
                      </span>
                    )}
                  </div>
                </div>

                {/* Question text */}
                <p className="font-medium text-gray-900 text-sm leading-relaxed mb-3">{q.text}</p>

                {/* Image */}
                {q.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={q.imageUrl}
                    alt="Question illustration"
                    className="max-h-48 object-contain rounded-xl border border-gray-200 mb-3"
                  />
                )}

                {/* Options */}
                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                    const optText = q[OPTION_LABELS[opt]]
                    const isSelected = ans.selectedOption === opt
                    const isAnswerCorrect = q.correctOption === opt

                    let cls = 'border-gray-200 bg-gray-50 text-gray-600'
                    if (isAnswerCorrect) cls = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold'
                    else if (isSelected && !isAnswerCorrect) cls = 'border-red-400 bg-red-50 text-red-800'

                    return (
                      <div
                        key={opt}
                        className={cn('flex items-start gap-3 px-4 py-2.5 rounded-xl border text-sm', cls)}
                      >
                        <span className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                          isAnswerCorrect ? 'bg-emerald-500 text-white' :
                          isSelected ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-600'
                        )}>
                          {opt}
                        </span>
                        <span className="pt-0.5">{optText}</span>
                        {isSelected && !isAnswerCorrect && (
                          <span className="ml-auto text-xs text-red-500 font-medium">Your answer</span>
                        )}
                        {isAnswerCorrect && (
                          <span className="ml-auto text-xs text-emerald-600 font-medium">✓ Correct</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-800 mb-0.5">Explanation</p>
                      <p className="text-xs text-blue-700 leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom nav */}
        <div className="flex justify-center mt-8">
          <Link
            href="/exams"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Practice More Exams →
          </Link>
        </div>
      </div>
    </div>
  )
}
