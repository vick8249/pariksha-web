import { db } from '@/lib/db'
import { updateSubject } from '../../actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Edit Subject' }

export default async function EditSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [subject, categories] = await Promise.all([
    db.subject.findUnique({ where: { id } }),
    db.category.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, select: { id: true, name: true } })
  ])

  if (!subject) notFound()

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/subjects" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Subject</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <form action={updateSubject} className="space-y-5">
          <input type="hidden" name="id" value={subject.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="categoryId"
              required
              defaultValue={subject.categoryId}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              required
              defaultValue={subject.name}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
            <input
              name="order"
              type="number"
              defaultValue={subject.order}
              className="w-32 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              defaultChecked={subject.isActive}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (Visible to students)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Save Changes
            </button>
            <Link
              href="/admin/subjects"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
