import { db } from '@/lib/db'
import { FileText, CheckCircle, XCircle } from 'lucide-react'
import { formatDate, formatTime, getGrade } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Reports' }

export default async function ReportsPage() {
  const attempts = await db.attempt.findMany({
    where: { status: 'COMPLETED' },
    orderBy: { submittedAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      exam: { select: { title: true, totalMarks: true, passingScore: true } }
    },
    take: 100 // Limit for now to prevent massive queries
  })

  // Calculate simple stats
  const totalAttempts = attempts.length
  const avgScore = totalAttempts > 0 ? (attempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts).toFixed(1) : 0
  const passed = attempts.filter(a => a.percentage >= a.exam.passingScore).length
  const passRate = totalAttempts > 0 ? Math.round((passed / totalAttempts) * 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1 text-sm">View student performance across all exams</p>
        </div>
        <a 
          href="/api/export-reports" 
          download="pariksha-reports.csv"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <FileText className="w-4 h-4" />
          Export to CSV
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Exams Submitted</p>
          <p className="text-3xl font-black text-gray-900">{totalAttempts}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">Average Score</p>
          <p className="text-3xl font-black text-indigo-600">{avgScore}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-1">Global Pass Rate</p>
          <p className="text-3xl font-black text-emerald-600">{passRate}%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {attempts.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500">No exams have been submitted yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Student</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Exam</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Score</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Percentage</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Time Taken</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attempts.map((attempt) => {
                const passed = attempt.percentage >= attempt.exam.passingScore
                const grade = getGrade(attempt.percentage)
                
                return (
                  <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{attempt.user.name}</p>
                      <p className="text-xs text-gray-500">{attempt.user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{attempt.exam.title}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {passed ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            <CheckCircle className="w-3 h-3" /> Pass
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            <XCircle className="w-3 h-3" /> Fail
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-medium text-gray-900">
                      {attempt.score} / {attempt.exam.totalMarks}
                    </td>
                    <td className="px-5 py-4 text-center font-bold">
                      <span className={grade.color}>{Math.round(attempt.percentage)}%</span>
                    </td>
                    <td className="px-5 py-4 text-center text-gray-600 font-mono text-xs">
                      {attempt.timeTaken ? formatTime(attempt.timeTaken) : '--:--'}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {attempt.submittedAt ? formatDate(attempt.submittedAt) : 'Unknown'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link 
                        href={`/admin/reports/${attempt.id}`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-semibold hover:underline"
                      >
                        View Details
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
