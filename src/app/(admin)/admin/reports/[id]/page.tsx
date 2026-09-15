import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CheckCircle, XCircle, Clock, Calendar, HelpCircle, Trophy } from 'lucide-react'
import { formatDate, formatTime, getGrade } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Attempt Analysis | Reports` }
}

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const attempt = await db.attempt.findUnique({
    where: { id },
    include: {
      user: true,
      exam: {
        include: { subject: { include: { category: true } } }
      },
      answers: {
        include: { question: true }
      }
    }
  })

  if (!attempt) notFound()

  const { exam, user, answers } = attempt
  const percentage = Math.round(attempt.percentage)
  const grade = getGrade(percentage)
  const passed = percentage >= exam.passingScore

  const correctAnswers = answers.filter(a => a.isCorrect).length
  const wrongAnswers = answers.filter(a => !a.isCorrect && a.selectedOption !== null).length
  const unattempted = answers.filter(a => a.selectedOption === null).length

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/reports" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Attempt Analysis</h1>
          <p className="text-sm text-gray-500 mt-0.5">Forensic view of student's exam performance</p>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm mb-8 flex flex-col md:flex-row gap-8 justify-between">
        
        {/* Student & Exam Info */}
        <div className="space-y-6 flex-1">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xl font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <Link href={`/admin/students/${user.id}`} className="text-indigo-600 hover:underline text-xs font-semibold mt-1 inline-block">
                View Full Profile
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Exam Details</p>
            <p className="font-bold text-gray-800 text-lg">{exam.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{exam.subject.category.name} — {exam.subject.name}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 md:justify-end flex-1">
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 min-w-[140px] flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Score</p>
            <p className="text-3xl font-black text-gray-900">{Math.round(attempt.score)}<span className="text-lg text-gray-400">/{exam.totalMarks}</span></p>
          </div>
          <div className={`p-5 rounded-2xl border min-w-[140px] flex flex-col items-center justify-center text-center ${grade.color.replace('text-', 'bg-').replace('600', '50').replace('500', '50')} ${grade.color.replace('text-', 'border-').replace('600', '100').replace('500', '100')}`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Percentage</p>
            <p className={`text-3xl font-black ${grade.color}`}>{percentage}%</p>
            <p className={`text-xs font-bold mt-1 uppercase ${passed ? 'text-emerald-600' : 'text-red-600'}`}>
              {passed ? 'Passed' : 'Failed'}
            </p>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 min-w-[140px] flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time / Date</p>
            <p className="text-lg font-bold text-gray-900 flex items-center gap-1"><Clock className="w-4 h-4" /> {attempt.timeTaken ? formatTime(attempt.timeTaken) : '--:--'}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(attempt.submittedAt!)}</p>
          </div>
        </div>
      </div>

      {/* Answer Breakdown */}
      <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-gray-400" />
        Question Breakdown
      </h2>
      
      <div className="space-y-6">
        {answers.sort((a, b) => a.question.order - b.question.order).map((answer, index) => {
          const q = answer.question
          const isCorrect = answer.isCorrect
          const isUnattempted = answer.selectedOption === null
          
          return (
            <div key={answer.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm">
                    Q{index + 1}
                  </span>
                  {isCorrect ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle className="w-4 h-4" /> Correct
                    </span>
                  ) : isUnattempted ? (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                      <HelpCircle className="w-4 h-4" /> Unattempted
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                      <XCircle className="w-4 h-4" /> Wrong
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  Marks Awarded: <span className={answer.marksAwarded > 0 ? 'text-emerald-600' : answer.marksAwarded < 0 ? 'text-red-600' : 'text-gray-900'}>{answer.marksAwarded > 0 ? '+' : ''}{answer.marksAwarded}</span> / {q.marks}
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-lg font-medium text-gray-900 mb-6 whitespace-pre-wrap">{q.text}</p>
                {q.imageUrl && (
                  <img src={q.imageUrl} alt="Question" className="max-w-md rounded-xl mb-6 border border-gray-200" />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'A', text: q.optionA },
                    { key: 'B', text: q.optionB },
                    { key: 'C', text: q.optionC },
                    { key: 'D', text: q.optionD },
                  ].map(opt => {
                    const isSelected = answer.selectedOption === opt.key
                    const isActuallyCorrect = q.correctOption === opt.key
                    
                    let bgClass = "bg-gray-50 border-gray-200 text-gray-700"
                    if (isActuallyCorrect) bgClass = "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-[0_0_0_1px_rgba(16,185,129,1)]"
                    else if (isSelected && !isActuallyCorrect) bgClass = "bg-red-50 border-red-500 text-red-800 shadow-[0_0_0_1px_rgba(239,68,68,1)]"
                    
                    return (
                      <div key={opt.key} className={`flex items-start p-4 rounded-xl border ${bgClass}`}>
                        <span className="w-6 h-6 rounded flex items-center justify-center font-bold text-sm bg-white/50 border border-black/10 shrink-0 mr-3">
                          {opt.key}
                        </span>
                        <span className="font-medium">{opt.text}</span>
                        {isSelected && <span className="ml-auto text-xs font-bold uppercase tracking-wider opacity-70">(Selected)</span>}
                        {isActuallyCorrect && !isSelected && <span className="ml-auto text-xs font-bold uppercase tracking-wider opacity-70">(Correct Answer)</span>}
                      </div>
                    )
                  })}
                </div>
                
                {q.explanation && (
                  <div className="mt-6 bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                    <p className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Explanation
                    </p>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{q.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
