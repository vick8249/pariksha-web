import { createCategory } from '../actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata = { title: 'Add Category' }

const EMOJI_OPTIONS = ['📚', '🎓', '📖', '✏️', '🧪', '🔬', '🧮', '📐', '🌍', '📝', '💡', '🏆', '⚡', '🎯', '📊']

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/categories" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Add Category</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a new exam category (e.g. Class 10, UPSC)</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <form action={createCategory} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              required
              placeholder="e.g. Class 10, UPSC Civil Services"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Hindi name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Hindi Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              name="nameHi"
              placeholder="e.g. कक्षा 10"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Brief description of this category"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="CLASS">Class (School)</option>
              <option value="COMPETITIVE">Competitive Exam</option>
              <option value="LANGUAGE">Language</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Icon Emoji <span className="text-gray-400">(optional)</span>
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <label key={emoji} className="cursor-pointer">
                  <input type="radio" name="iconUrl" value={emoji} className="sr-only peer" />
                  <span className="text-2xl peer-checked:ring-2 peer-checked:ring-indigo-500 rounded-lg p-1 hover:bg-gray-100 block transition-all">
                    {emoji}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
            <input
              name="order"
              type="number"
              defaultValue={0}
              min={0}
              className="w-32 px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
          </div>

          {/* Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              defaultChecked
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Make this category visible to students
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
              Create Category
            </button>
            <Link
              href="/admin/categories"
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
