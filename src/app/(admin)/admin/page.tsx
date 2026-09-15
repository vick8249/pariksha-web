import { db } from '@/lib/db'
import Link from 'next/link'
import { Users, BookOpen, Trophy, TrendingUp, ArrowRight, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Admin Dashboard' }

async function getAdminStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalStudents, newStudentsToday,
    totalExams, publishedExams,
    totalAttempts, attemptsToday,
    recentAttempts,
  ] = await Promise.all([
    db.user.count({ where: { role: 'STUDENT' } }),
    db.user.count({ where: { role: 'STUDENT', createdAt: { gte: today } } }),
    db.exam.count(),
    db.exam.count({ where: { isPublished: true } }),
    db.attempt.count({ where: { status: 'COMPLETED' } }),
    db.attempt.count({ where: { status: 'COMPLETED', submittedAt: { gte: today } } }),
    db.attempt.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { submittedAt: 'desc' },
      take: 8,
      include: {
        user: { select: { id: true, name: true, email: true } },
        exam: { select: { title: true } },
      },
    }),
  ])

  const avgScore = await db.attempt.aggregate({
    where: { status: 'COMPLETED' },
    _avg: { percentage: true },
  })

  return {
    totalStudents, newStudentsToday,
    totalExams, publishedExams,
    totalAttempts, attemptsToday,
    avgScore: Math.round(avgScore._avg.percentage ?? 0),
    recentAttempts,
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening on your exam portal today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          {
            label: 'Total Students',
            value: stats.totalStudents,
            sub: `+${stats.newStudentsToday} today`,
            icon: Users,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            href: '/admin/students',
          },
          {
            label: 'Exams',
            value: stats.totalExams,
            sub: `${stats.publishedExams} published`,
            icon: BookOpen,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            href: '/admin/exams',
          },
          {
            label: 'Tests Taken',
            value: stats.totalAttempts,
            sub: `${stats.attemptsToday} today`,
            icon: Trophy,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            href: '/admin/reports',
          },
          {
            label: 'Avg Score',
            value: `${stats.avgScore}%`,
            sub: 'across all attempts',
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            href: '/admin/reports',
          },
        ].map(({ label, value, sub, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className={`text-3xl font-extrabold mt-1 ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
              </div>
              <div className={`w-10 h-10 ${bg} dark:bg-gray-800 rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-gray-100">Recent Exam Attempts</h2>
            <Link href="/admin/reports" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {stats.recentAttempts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No attempts yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {stats.recentAttempts.map((attempt) => (
                <div key={attempt.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{attempt.user.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{attempt.exam.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`text-sm font-bold ${
                          attempt.percentage >= 60 ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {Math.round(attempt.percentage)}%
                      </span>
                      <p className="text-xs text-gray-400">
                        {formatDate(attempt.submittedAt ?? attempt.startedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/reports/${attempt.id}`} 
                        className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800/50 dark:text-indigo-400 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        X-Ray
                      </Link>
                      <Link 
                        href={`/admin/students/${attempt.user.id}`} 
                        className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Add New Category', href: '/admin/categories', color: 'bg-indigo-600', desc: 'Class, subject or competitive' },
              { label: 'Create New Exam', href: '/admin/exams/new', color: 'bg-emerald-600', desc: 'Set duration, marks & questions' },
              { label: 'Add Questions', href: '/admin/exams', color: 'bg-amber-500', desc: 'Add MCQs to existing exams' },
            ].map(({ label, href, color, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800"
              >
                <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
