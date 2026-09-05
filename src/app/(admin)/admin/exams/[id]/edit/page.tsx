import { db } from '@/lib/db'
import { updateExam } from '../../actions'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Edit Exam' }

export default async function EditExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [exam, subjects] = await Promise.all([
    db.exam.findUnique({ where: { id } }),
    db.subject.findMany({ where: { isActive: true }, orderBy: { categoryId: 'asc' }, include: { category: true } })
  ])

  if (!exam) notFound()

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/exams" className="text-gray-400 hover:text-gray-600"><ChevronLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Exam</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <form action={updateExam} className="space-y-6">
          <input type="hidden" name="id" value={exam.id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Exam Title <span className="text-red-500">*</span></label>
              <input name="title" required defaultValue={exam.title} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
              <select name="subjectId" required defaultValue={exam.subjectId} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                {subjects.map(s => <option key={s.id} value={s.id}>{s.category.name} — {s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (minutes)</label>
              <input name="duration" type="number" required defaultValue={exam.duration} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Passing Score (%)</label>
              <input name="passingScore" type="number" required defaultValue={exam.passingScore} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea name="description" rows={2} defaultValue={exam.description ?? ''} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructions</label>
              <textarea name="instructions" rows={3} defaultValue={exam.instructions ?? ''} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="negativeMarking" name="negativeMarking" defaultChecked={exam.negativeMarking} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
              <label htmlFor="negativeMarking" className="text-sm font-medium text-gray-700">Enable Negative Marking</label>
            </div>
            
            <div className="flex items-center gap-3">
              <input type="checkbox" id="shuffleQuestions" name="shuffleQuestions" defaultChecked={exam.shuffleQuestions} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300" />
              <label htmlFor="shuffleQuestions" className="text-sm font-medium text-gray-700">Shuffle Questions</label>
            </div>
            
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isPublished" name="isPublished" defaultChecked={exam.isPublished} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300" />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Publish (Visible to students)</label>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
