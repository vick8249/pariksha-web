import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, GraduationCap, Trophy, Clock, Target, Calendar, ArrowRight } from 'lucide-react'
import { formatDate, getGrade } from '@/lib/utils'
import ResetPasswordButton from '../ResetPasswordButton'
import DeleteStudentButton from '../DeleteStudentButton'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const student = await db.user.findUnique({ where: { id }, select: { name: true } })
  return { title: student ? `${student.name} | Student Profile` : 'Student Not Found' }
}

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const student = await db.user.findUnique({
    where: { id, role: 'STUDENT' },
    include: {
      attempts: {
        where: { status: 'COMPLETED' },
        orderBy: { submittedAt: 'desc' },
        include: {
          exam: { select: { title: true, passingScore: true, totalMarks: true } }
        }
      }
    }
  })

  if (!student) notFound()

  const attempts = student.attempts
  const totalAttempts = attempts.length
  const avgScore = totalAttempts > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts) 
    : 0
  const passed = attempts.filter(a => a.percentage >= a.exam.passingScore).length
  const passRate = totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0
  const bestAttempt = totalAttempts > 0 ? [...attempts].sort((a, b) => b.percentage - a.percentage)[0] : null

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/students" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Student Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">Detailed analytics and attempt history</p>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-8 sm:ml-0">
          <ResetPasswordButton userId={student.id} studentName={student.name} />
          <DeleteStudentButton userId={student.id} studentName={student.name} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-3xl font-black mb-4">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">{student.name}</h2>
          <p className="text-gray-500 text-sm font-medium">{student.email}</p>
          
          <div className="mt-6 w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Class / Category</p>
            <p className="font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              {student.class || 'Not specified'}
            </p>
          </div>
          <div className="mt-3 w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Joined Date</p>
            <p className="font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              {formatDate(student.createdAt)}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-600">Total Exams</p>
            </div>
            <p className="text-4xl font-black text-gray-900">{totalAttempts}</p>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="font-semibold text-gray-600">Average Score</p>
            </div>
            <p className="text-4xl font-black text-gray-900">{avgScore}%</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-purple-600" />
              </div>
              <p className="font-semibold text-gray-600">Pass Rate</p>
            </div>
            <p className="text-4xl font-black text-gray-900">{passRate}%</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <p className="font-semibold text-gray-600">Best Score</p>
            </div>
            <p className="text-4xl font-black text-gray-900">
              {bestAttempt ? `${Math.round(bestAttempt.percentage)}%` : '-'}
            </p>
            {bestAttempt && (
              <p className="text-xs text-gray-500 mt-1 truncate">{bestAttempt.exam.title}</p>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-extrabold text-gray-900 mb-4">Exam History</h2>
      
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {totalAttempts === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 font-medium">No exams completed yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Exam</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Score</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Percentage</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attempts.map(attempt => {
                const grade = getGrade(attempt.percentage)
                return (
                  <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{attempt.exam.title}</td>
                    <td className="px-5 py-4 text-center font-medium text-gray-600">
                      {Math.round(attempt.score)} / {attempt.exam.totalMarks}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`font-bold ${grade.color}`}>{Math.round(attempt.percentage)}%</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {formatDate(attempt.submittedAt!)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link 
                        href={`/admin/reports/${attempt.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        X-Ray View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
