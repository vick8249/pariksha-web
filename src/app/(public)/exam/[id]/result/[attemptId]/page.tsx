import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import Link from 'next/link'
import {
  Trophy, CheckCircle, XCircle, Clock, BookOpen,
  ArrowRight, RotateCcw, Award
} from 'lucide-react'
import { formatTime, getGrade } from '@/lib/utils'

export const metadata = { title: 'Exam Result' }

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>
}) {
  const { id, attemptId } = await params
  const session = await requireAuth()

  const attempt = await db.attempt.findFirst({
    where: { id: attemptId, userId: session.userId },
    include: {
      exam: {
        include: { subject: { include: { category: true } } },
      },
      answers: true,
    },
  })

  if (!attempt || attempt.status !== 'COMPLETED') notFound()

  const exam = attempt.exam
  const percentage = Math.round(attempt.percentage)
  const grade = getGrade(percentage)
  const passed = percentage >= exam.passingScore
  const correctCount = attempt.answers.filter((a) => a.isCorrect).length
  const wrongCount = attempt.answers.filter((a) => !a.isCorrect && a.selectedOption !== null).length
  const skippedCount = attempt.answers.filter((a) => a.selectedOption === null).length

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Result Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div
            className={`p-8 text-white text-center ${
              passed
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                : 'bg-gradient-to-br from-red-500 to-rose-600'
            }`}
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {passed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <XCircle className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-extrabold">
              {passed ? '🎉 Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-white/80 mt-1 text-sm">{exam.title}</p>
            <div className="text-6xl font-extrabold mt-4">{percentage}%</div>
            <div className={`text-lg font-semibold mt-1 ${grade.color.replace('text-', 'text-white/80 text-')}`}>
              {grade.label}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
            {[
              { label: 'Score', value: `${Math.round(attempt.score)}/${attempt.totalMarks}`, icon: Trophy, color: 'text-indigo-600' },
              { label: 'Correct', value: correctCount, icon: CheckCircle, color: 'text-emerald-600' },
              { label: 'Wrong', value: wrongCount, icon: XCircle, color: 'text-red-500' },
              { label: 'Time Taken', value: formatTime(attempt.timeTaken ?? 0), icon: Clock, color: 'text-gray-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white p-4 text-center">
                <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                <div className={`text-xl font-extrabold ${color}`}>{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          {/* Analysis bar */}
          <div className="p-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Performance breakdown</span>
              <span>{attempt.answers.length} questions</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${(correctCount / attempt.answers.length) * 100}%` }}
              />
              <div
                className="bg-red-400 h-full"
                style={{ width: `${(wrongCount / attempt.answers.length) * 100}%` }}
              />
              <div
                className="bg-gray-300 h-full"
                style={{ width: `${(skippedCount / attempt.answers.length) * 100}%` }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Correct ({correctCount})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Wrong ({wrongCount})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> Skipped ({skippedCount})</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="p-6 pt-0 space-y-3">
            {/* Certificate button — only shown when passed */}
            {passed && (
              <Link
                href={`/exam/${id}/result/${attemptId}/certificate`}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <Award className="w-5 h-5" />
                Download / Print Certificate
              </Link>
            )}
            <Link
              href={`/exam/${id}/review/${attemptId}`}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Review All Questions &amp; Explanations
            </Link>
            <div className="flex gap-3">
              <Link
                href={`/exam/${id}`}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Exam
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
                My Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
