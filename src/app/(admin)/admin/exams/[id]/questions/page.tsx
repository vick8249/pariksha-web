import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, ChevronLeft, CheckCircle2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { deleteQuestion } from './actions'
import { BulkUploadQuestions } from '@/components/admin/BulkUploadQuestions'

export const metadata = { title: 'Manage Questions' }

export default async function ExamQuestionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // Fetch exam and its questions
  const exam = await db.exam.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { order: 'asc' } },
      subject: { select: { name: true } }
    },
  })

  if (!exam) notFound()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/exams" className="text-gray-400 hover:text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Questions: {exam.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {exam.subject.name} • {exam.questions.length} Questions • {exam.totalMarks} Total Marks
            </p>
          </div>
        </div>
        <Link
          href={`/admin/exams/${exam.id}/questions/new`}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </Link>
      </div>

      <BulkUploadQuestions examId={exam.id} />

      {/* Questions List */}
      <div className="space-y-4">
        {exam.questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">
            <p className="font-medium text-gray-500">No questions added yet.</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Question" to build this exam.</p>
          </div>
        ) : (
          exam.questions.map((q, index) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-1 rounded-lg mt-0.5">
                    Q{index + 1}
                  </span>
                  <p className="font-medium text-gray-900 text-sm leading-relaxed max-w-3xl">
                    {q.text}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {q.marks} Mark{q.marks !== 1 ? 's' : ''}
                  </span>
                  {/* Edit/Delete buttons (placeholders for Step 3) */}
                  <DeleteButton 
                    id={q.id} 
                    action={deleteQuestion} 
                    confirmMessage="Delete this question?" 
                  />
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                  const isCorrect = q.correctOption === opt
                  const text = q[`option${opt}` as keyof typeof q] as string
                  
                  return (
                    <div 
                      key={opt} 
                      className={`flex items-start gap-2 text-sm p-2 rounded-lg border ${
                        isCorrect 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' 
                          : 'border-gray-100 text-gray-600 bg-gray-50'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {opt}
                      </span>
                      <span>{text}</span>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0" />}
                    </div>
                  )
                })}
              </div>
              
              {/* Explanation (if exists) */}
              {q.explanation && (
                <div className="mt-4 pl-11">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-blue-800 mb-1">Explanation:</p>
                    <p className="text-xs text-blue-700">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
