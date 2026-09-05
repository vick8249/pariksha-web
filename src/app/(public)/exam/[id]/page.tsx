import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Clock, Users, Target, AlertTriangle, ChevronRight, CheckCircle } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { getSession } from '@/lib/session'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exam = await db.exam.findUnique({ where: { id }, select: { title: true } })
  return { title: exam?.title ?? 'Exam' }
}

export default async function ExamInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [exam, session] = await Promise.all([
    db.exam.findUnique({
      where: { id, isPublished: true },
      include: {
        subject: { include: { category: true } },
        _count: { select: { questions: true, attempts: true } },
      },
    }),
    getSession(),
  ])

  if (!exam) notFound()

  // Check if user has an in-progress attempt
  let inProgressAttempt = null
  if (session) {
    inProgressAttempt = await db.attempt.findFirst({
      where: { userId: session.userId, examId: id, status: 'IN_PROGRESS' },
    })
  }

  const instructions = [
    `This exam has ${exam._count.questions} questions worth ${exam.totalMarks} marks total.`,
    `You have ${formatDuration(exam.duration)} to complete the exam. The timer starts when you click "Start Exam".`,
    exam.negativeMarking
      ? `Negative marking is enabled. Each wrong answer deducts ${exam.negativeFactor} × marks from your score.`
      : 'There is no negative marking. Unattempted questions score zero.',
    'You can navigate between questions freely using the question palette.',
    'Your answers are saved automatically. The exam auto-submits when time runs out.',
    'You can review your answers and read explanations after submission.',
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/exams" className="hover:text-gray-600">Exams</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600 font-medium truncate">{exam.title}</span>
        </nav>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8">
            <div className="flex items-center gap-2 text-indigo-200 text-sm mb-2">
              <span>{exam.subject.category.name}</span>
              <ChevronRight className="w-3 h-3" />
              <span>{exam.subject.name}</span>
            </div>
            <h1 className="text-2xl font-extrabold mb-3">{exam.title}</h1>
            {exam.description && (
              <p className="text-indigo-200 text-sm leading-relaxed">{exam.description}</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
            {[
              { icon: BookOpen, label: 'Questions', value: exam._count.questions },
              { icon: Clock, label: 'Duration', value: formatDuration(exam.duration) },
              { icon: Target, label: 'Total Marks', value: exam.totalMarks },
              { icon: Users, label: 'Attempts', value: exam._count.attempts },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white p-5 flex flex-col items-center text-center">
                <Icon className="w-5 h-5 text-indigo-500 mb-1" />
                <div className="text-xl font-extrabold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          {/* Negative marking warning */}
          {exam.negativeMarking && (
            <div className="mx-6 mt-5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Negative Marking Enabled</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Each wrong answer will deduct {exam.negativeFactor} marks. Unanswered questions score zero.
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="p-6">
            <h2 className="font-bold text-gray-900 text-base mb-4">Instructions</h2>
            <ul className="space-y-3">
              {instructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {inst}
                </li>
              ))}
              {exam.instructions && (
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {exam.instructions}
                </li>
              )}
            </ul>
          </div>

          {/* CTA */}
          <div className="p-6 pt-0">
            {session ? (
              <div className="flex flex-col sm:flex-row gap-3">
                {inProgressAttempt ? (
                  <Link
                    href={`/exam/${exam.id}/start?resume=${inProgressAttempt.id}`}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl text-center transition-colors"
                  >
                    Resume Exam →
                  </Link>
                ) : (
                  <Link
                    href={`/exam/${exam.id}/start`}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-center transition-colors"
                  >
                    Start Exam →
                  </Link>
                )}
                <Link
                  href="/exams"
                  className="px-6 py-3.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 text-center transition-colors"
                >
                  Back to Exams
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 text-center">
                  You can browse, but you need an account to save your results.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/auth/register"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-center transition-colors"
                  >
                    Register & Start Free
                  </Link>
                  <Link
                    href={`/auth/login?redirect=/exam/${exam.id}/start`}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3.5 rounded-xl text-center transition-colors"
                  >
                    Log In to Start
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
