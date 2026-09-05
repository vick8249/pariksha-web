import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, Tag } from 'lucide-react'
import { DeleteButton } from '@/components/admin/DeleteButton'
import { deleteSubject } from './actions'

export const metadata = { title: 'Manage Subjects' }

export default async function SubjectsPage() {
  const subjects = await db.subject.findMany({
    include: { category: true, _count: { select: { exams: true } } },
    orderBy: { categoryId: 'asc' }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Subjects</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage subjects under categories</p>
        </div>
        <Link
          href="/admin/subjects/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {subjects.length === 0 ? (
          <div className="py-20 text-center">
            <Tag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500">No subjects yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Subject Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Exams</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{sub.name}</td>
                  <td className="px-5 py-4 text-gray-600">{sub.category.name}</td>
                  <td className="px-5 py-4 text-gray-600">{sub._count.exams}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DeleteButton id={sub.id} action={deleteSubject} confirmMessage="Delete this subject?" />
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
