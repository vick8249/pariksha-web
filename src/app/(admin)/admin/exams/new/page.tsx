import { db } from '@/lib/db'
import { createExam } from '../actions'
import Link from 'next/link'
import { ChevronLeft, Info } from 'lucide-react'

export const metadata = { title: 'Add Exam' }

export default async function NewExamPage() {
  const subjects = await db.subject.findMany({
    where: { isActive: true },
    orderBy: { categoryId: 'asc' },
    include: { category: { select: { name: true } } }
  })

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/exams" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Create Exam</h1>
          <p className="text-sm text-gray-500 mt-0.5">Setup a new test paper</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <form action={createExam} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Exam Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                required
                placeholder="e.g. UPSC Prelims Mock Test 1"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subject Dropdown */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                name="subjectId"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">Select subject...</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.category.name} — {s.name}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (minutes)</label>
              <input
                name="duration"
                type="number"
                required
                defaultValue={60}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Passing Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passing Score (%)</label>
              <input
                name="passingScore"
                type="number"
                required
                defaultValue={60}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (optional)</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Brief description of what this exam covers"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Instructions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructions (optional)</label>
              <textarea
                name="instructions"
                rows={3}
                placeholder="Read carefully before starting..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="negativeMarking" name="negativeMarking" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
              <label htmlFor="negativeMarking" className="text-sm font-medium text-gray-700">Enable Negative Marking</label>
            </div>
            
            <div className="flex items-center gap-3">
              <input type="checkbox" id="shuffleQuestions" name="shuffleQuestions" defaultChecked className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
              <label htmlFor="shuffleQuestions" className="text-sm font-medium text-gray-700">Shuffle Questions for each student</label>
            </div>
            
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isPublished" name="isPublished" defaultChecked className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Publish Immediately (Visible to students)</label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Total marks are automatically calculated based on the questions you add after creating the exam.
            </p>
          </div>

          <div className="pt-2">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              Create Exam & Continue to Questions
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
