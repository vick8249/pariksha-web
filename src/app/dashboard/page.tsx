import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import {
  BookOpen, Clock, Trophy, TrendingUp, User,
  CheckCircle, XCircle, ArrowRight, Calendar
} from 'lucide-react'
import { formatDate, formatDuration, calcPercentage, getGrade } from '@/lib/utils'

export const metadata = { title: 'My Dashboard' }

async function getUserAttempts(userId: string) {
  return db.attempt.findMany({
    where: { userId, status: 'COMPLETED' },
    orderBy: { submittedAt: 'desc' },
    take: 10,
    include: {
      exam: {
        include: { subject: { include: { category: true } } },
      },
    },
  })
}

async function getUserStats(userId: string) {
  const attempts = await db.attempt.findMany({
    where: { userId, status: 'COMPLETED' },
    select: { score: true, totalMarks: true, percentage: true },
  })
  const total = attempts.length
  const avgScore = total > 0
    ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / total)
    : 0
  const best = total > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0
  return { total, avgScore, best }
}

export default async function DashboardPage() {
  const session = await requireAuth()
  const [user, attempts, stats] = await Promise.all([
    db.user.findUnique({
      where: { id: session.userId },
      select: { name: true, email: true, class: true, createdAt: true },
    }),
    getUserAttempts(session.userId),
    getUserStats(session.userId),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-sm mb-1">Student Dashboard</p>
              <h1 className="text-2xl font-extrabold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-indigo-200 text-sm mt-1">
                {user?.class ?? 'No class selected'} · Joined {formatDate(user?.createdAt ?? new Date())}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/exams"
                className="bg-white text-indigo-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Browse Exams
              </Link>
              <form action={logout}>
                <button className="text-indigo-200 text-sm hover:text-white transition-colors">Logout</button>
              </form>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Tests Taken', value: stats.total, icon: BookOpen },
              { label: 'Average Score', value: `${stats.avgScore}%`, icon: TrendingUp },
              { label: 'Best Score', value: `${stats.best}%`, icon: Trophy },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <Icon className="w-5 h-5 text-indigo-200 mb-2" />
                <div className="text-2xl font-extrabold">{value}</div>
                <div className="text-xs text-indigo-200 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attempt History */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Recent Test Attempts</h2>
            {attempts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-500">No tests taken yet</p>
                <p className="text-sm text-gray-400 mt-1">Start your first exam to see results here.</p>
                <Link
                  href="/exams"
                  className="inline-flex items-center gap-2 mt-4 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Take First Exam <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {attempts.map((attempt) => {
                  const grade = getGrade(attempt.percentage)
                  const passed = attempt.percentage >= attempt.exam.passingScore
                  return (
                    <div key={attempt.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {attempt.exam.subject.category.name}
                          </span>
                          {passed
                            ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                            : <XCircle className="w-4 h-4 text-red-400" />
                          }
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{attempt.exam.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(attempt.submittedAt ?? attempt.startedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {attempt.timeTaken ? `${Math.round(attempt.timeTaken / 60)} min` : '—'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-2xl font-extrabold ${grade.color}`}>
                          {Math.round(attempt.percentage)}%
                        </div>
                        <div className="text-xs text-gray-400">
                          {attempt.score}/{attempt.totalMarks} marks
                        </div>
                        <Link
                          href={`/exam/${attempt.examId}/review/${attempt.id}`}
                          className="text-xs text-indigo-600 hover:underline mt-1 inline-block"
                        >
                          Review →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Profile card */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Class / Category</span>
                  <span className="font-medium text-gray-800">{user?.class ?? '—'}</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'Browse All Exams', href: '/exams' },
                  { label: 'Browse Categories', href: '/categories' },
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
