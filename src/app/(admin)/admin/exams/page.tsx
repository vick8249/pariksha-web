import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, BookOpen } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { deleteExam } from './actions'

export const metadata = { title: 'Manage Exams' }

export default async function ExamsPage() {
  const exams = await db.exam.findMany({
    include: { subject: { include: { category: true } }, _count: { select: { questions: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Exams</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage test papers and questions</p>
        </div>
        <Link
          href="/admin/exams/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Exam
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {exams.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500">No exams yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Exam Title</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Subject</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Questions</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{exam.title}</td>
                  <td className="px-5 py-4 text-gray-600">{exam.subject.name}</td>
                  <td className="px-5 py-4 text-gray-600">{exam._count.questions} Qs</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${exam.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {exam.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/exams/${exam.id}/questions`}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors inline-block"
                      >
                        Manage Questions
                      </Link>
                      <Link
                        href={`/admin/exams/${exam.id}/edit`}
                        className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={exam.id} action={deleteExam} confirmMessage="Delete this exam completely?" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
