import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react'
import { deleteCategory } from './actions'
import { revalidatePath } from 'next/cache'
import { DeleteButton } from '@/components/admin/DeleteButton'

export const metadata = { title: 'Manage Categories' }

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { order: 'asc' },
    include: {
      subjects: { select: { id: true } },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage exam categories (e.g. Class 10, UPSC, SSC)
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500">No categories yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first category to get started</p>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center gap-2 mt-4 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Category
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Type</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Subjects</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.iconUrl ?? '📚'}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{cat.name}</p>
                        <p className="text-xs text-gray-400">/{cat.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {cat.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{cat.subjects.length}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                        cat.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${cat.id}/edit`}
                        className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Link>
                      <DeleteButton 
                        id={cat.id} 
                        action={deleteCategory} 
                        confirmMessage="Delete this category? All subjects and exams under it will also be deleted."
                      />
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
