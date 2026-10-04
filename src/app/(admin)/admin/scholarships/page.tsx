import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Trophy, FileText, CheckCircle2, XCircle } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { deleteExam } from '../exams/actions'

export const metadata = { title: 'Manage Scholarships' }

export default async function ScholarshipsPage() {
  const exams = await db.exam.findMany({
    where: { isPremium: true },
    include: { subject: { include: { category: true } }, _count: { select: { questions: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Scholarship Exams
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Manage premium tournaments and scholarship tests</p>
        </div>
        <Link
          href="/admin/scholarships/new"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Scholarship Exam
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {exams.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No scholarship exams found.
          </div>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Questions</th>
                <th className="px-6 py-4">Entry Fee</th>
                <th className="px-6 py-4">Prize Pool</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exams.map(exam => (
                <tr key={exam.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{exam.title}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {exam.subject.category.name} › {exam.subject.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{exam._count.questions}</td>
                  <td className="px-6 py-4 font-bold text-amber-600">₹{exam.entryFee ?? 0}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">₹{exam.prizePool ?? 0}</td>
                  <td className="px-6 py-4">
                    {exam.isPublished ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/exams/${exam.id}/questions`}
                        className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors tooltip-trigger"
                        title="Questions"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/exams/${exam.id}/edit`}
                        className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteButton action={deleteExam} id={exam.id} />
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
