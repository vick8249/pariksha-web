import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import {
  BookOpen, Clock, Trophy, TrendingUp, User,
  CheckCircle, XCircle, ArrowRight, Calendar, Target,
  PlayCircle, AlertCircle, Award
} from 'lucide-react'
import { formatDate, getGrade } from '@/lib/utils'

export const metadata = { title: 'My Dashboard' }

async function getUserAttempts(userId: string, status: 'COMPLETED' | 'IN_PROGRESS') {
  return db.attempt.findMany({
    where: { userId, status },
    orderBy: { startedAt: 'desc' },
    take: status === 'COMPLETED' ? 10 : 3,
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
    select: { score: true, totalMarks: true, percentage: true, exam: { select: { passingScore: true } } },
  })
  const total = attempts.length
  const avgScore = total > 0
    ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / total)
    : 0
  const best = total > 0 ? Math.round(Math.max(...attempts.map(a => a.percentage))) : 0
  
  const passed = attempts.filter(a => a.percentage >= a.exam.passingScore).length
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0

  return { total, avgScore, best, passed, passRate }
}

async function getRecommendedCategorySlug(userClass: string | null) {
  if (!userClass || userClass === 'Other') return null
  
  // E.g. "UPSC Aspirant" -> "UPSC"
  const searchTerm = userClass.replace(' Aspirant', '').trim()
  
  const category = await db.category.findFirst({
    where: {
      isActive: true,
      name: {
        contains: searchTerm,
        mode: 'insensitive'
      }
    },
    select: { slug: true }
  })
  
  return category?.slug || null
}

export default async function DashboardPage() {
  const session = await requireAuth()
  const [user, completedAttempts, inProgressAttempts, stats] = await Promise.all([
    db.user.findUnique({
      where: { id: session.userId },
      select: { name: true, email: true, class: true, createdAt: true },
    }),
    getUserAttempts(session.userId, 'COMPLETED'),
    getUserAttempts(session.userId, 'IN_PROGRESS'),
    getUserStats(session.userId),
  ])

  const recommendedSlug = user?.class ? await getRecommendedCategorySlug(user.class) : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-28 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-purple-900 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
                <User className="w-4 h-4" /> Student Dashboard
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-indigo-200 dark:text-gray-300 text-base">
                {user?.class ?? 'No class selected'} · Member since {formatDate(user?.createdAt ?? new Date())}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle className="bg-white/10 hover:bg-white/20 text-white dark:bg-gray-800 dark:hover:bg-gray-700 backdrop-blur-md border border-white/20" />
              <Link
                href="/exams"
                className="bg-white text-indigo-900 dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700 font-extrabold text-sm px-6 py-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Browse Exams
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 border-t border-white/10 pt-8 relative z-10">
            {[
              { label: 'Total Tests', value: stats.total, icon: BookOpen, color: 'text-blue-300' },
              { label: 'Avg Score', value: `${stats.avgScore}%`, icon: TrendingUp, color: 'text-emerald-300' },
              { label: 'Best Score', value: `${stats.best}%`, icon: Trophy, color: 'text-amber-300' },
              { label: 'Pass Rate', value: `${stats.passRate}%`, icon: Target, color: 'text-purple-300' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                <Icon className={`w-6 h-6 mb-3 ${color}`} />
                <div className="text-3xl font-extrabold">{value}</div>
                <div className="text-sm text-indigo-200 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* In Progress Tests (Only show if there are any) */}
            {inProgressAttempts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-5">
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">Resume In-Progress Tests</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {inProgressAttempts.map((attempt) => (
                    <div key={attempt.id} className="bg-white dark:bg-gray-900 border-2 border-amber-200 dark:border-amber-900/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                        In Progress
                      </div>
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1 mt-2 uppercase tracking-wide">
                        {attempt.exam.subject.name}
                      </div>
                      <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-base mb-4 leading-tight">{attempt.exam.title}</h3>
                      <Link
                        href={`/exam/${attempt.examId}/start?resume=${attempt.id}`}
                        className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm shadow-md shadow-amber-200 dark:shadow-none"
                      >
                        <PlayCircle className="w-4 h-4" /> Resume Test
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Completed Test History */}
            <section>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-indigo-500" />
                Recent Completions
              </h2>
              
              {completedAttempts.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-sm">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-indigo-300 dark:text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">No tests taken yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">Start your first exam to build your performance history and unlock insights.</p>
                  <Link
                    href="/exams"
                    className="inline-flex items-center gap-2 bg-indigo-600 dark:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Take First Exam <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedAttempts.map((attempt) => {
                    const grade = getGrade(attempt.percentage)
                    const passed = attempt.percentage >= attempt.exam.passingScore
                    return (
                      <div key={attempt.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-lg uppercase tracking-wide">
                              {attempt.exam.subject.category.name}
                            </span>
                            {passed ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md uppercase tracking-wider">
                                <CheckCircle className="w-3 h-3" /> Passed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-md uppercase tracking-wider">
                                <XCircle className="w-3 h-3" /> Failed
                              </span>
                            )}
                          </div>
                          <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-lg mb-2">{attempt.exam.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(attempt.submittedAt ?? attempt.startedAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {attempt.timeTaken ? `${Math.floor(attempt.timeTaken / 60)}m ${attempt.timeTaken % 60}s` : '—'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 sm:pl-6 sm:border-l border-gray-100 dark:border-gray-800">
                          <div className="text-center">
                            <div className={`text-3xl font-black ${grade.color}`}>
                              {Math.round(attempt.percentage)}<span className="text-lg">%</span>
                            </div>
                            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
                              {attempt.score}/{attempt.totalMarks} Marks
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Link
                              href={`/exam/${attempt.examId}/result/${attempt.id}`}
                              className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-600 dark:text-gray-400 rounded-full transition-colors flex-shrink-0 border border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700"
                              aria-label="View Details"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            
                            {passed && (
                              <Link
                                href={`/exam/${attempt.examId}/result/${attempt.id}/certificate`}
                                className="w-10 h-10 flex items-center justify-center bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-600 dark:text-amber-500 rounded-full transition-colors flex-shrink-0 border border-amber-200 dark:border-amber-700/50 hover:border-amber-300 dark:hover:border-amber-600"
                                aria-label="View Certificate"
                                title="View Certificate"
                              >
                                <Award className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* User Profile Mini */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-100 dark:from-indigo-900/20 to-white dark:to-gray-900" />
              <div className="relative flex flex-col items-center text-center mt-6">
                <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-xl mb-4">
                  <div className="w-full h-full bg-indigo-600 dark:bg-indigo-700 rounded-full flex items-center justify-center text-white text-2xl font-black">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="font-extrabold text-xl text-gray-900 dark:text-gray-100">{user?.name}</div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">{user?.email}</div>
                
                <Link 
                  href="/account"
                  className="mb-6 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Edit Profile
                </Link>
                
                <div className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 text-left border border-gray-100 dark:border-gray-800">
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Class / Category</div>
                  <div className="font-bold text-gray-900 dark:text-gray-200">{user?.class ?? 'Not specified'}</div>
                </div>
              </div>
            </div>

            {/* Performance Visualizer */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <h3 className="font-extrabold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Performance Level
              </h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{stats.avgScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 dark:bg-indigo-600 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.avgScore}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Highest Score</span>
                    <span className="text-amber-500 dark:text-amber-400">{stats.best}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 dark:bg-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.best}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Pass Rate</span>
                    <span className={stats.passRate >= 50 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}>
                      {stats.passRate}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${stats.passRate >= 50 ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-rose-500 dark:bg-rose-600'}`}
                      style={{ width: `${stats.passRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <h3 className="font-extrabold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h3>
              <div className="space-y-3">
                {user?.class && recommendedSlug && (
                  <Link
                    href={`/category/${recommendedSlug}`}
                    className="flex items-center justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/50 hover:border-emerald-200 dark:hover:border-emerald-700 rounded-xl p-4 transition-all hover:translate-x-1"
                  >
                    🚀 My {user.class.replace(' Aspirant', '')} Subjects
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {[
                  { label: 'Explore All Categories', href: '/categories' },
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-gray-100 dark:border-gray-800 hover:border-indigo-100 dark:hover:border-indigo-800 rounded-xl p-4 transition-all hover:translate-x-1"
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
