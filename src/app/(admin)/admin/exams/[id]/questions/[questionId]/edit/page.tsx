import { db } from '@/lib/db'
import { updateQuestion } from '../../actions'
import Link from 'next/link'
import { ChevronLeft, Image as ImageIcon } from 'lucide-react'
import { notFound } from 'next/navigation'

export const metadata = { title: 'Edit Question' }

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string; questionId: string }>
}) {
  const { id: examId, questionId } = await params

  const [exam, question] = await Promise.all([
    db.exam.findUnique({ where: { id: examId }, select: { id: true, title: true } }),
    db.question.findUnique({ where: { id: questionId } }),
  ])

  if (!exam || !question || question.examId !== examId) notFound()

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/admin/exams/${exam.id}/questions`} className="text-gray-400 hover:text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Question</h1>
          <p className="text-sm text-gray-500 mt-0.5">Editing in: {exam.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <form action={updateQuestion} className="space-y-8">
          <input type="hidden" name="id" value={question.id} />

          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Question Text <span className="text-red-500">*</span>
            </label>
            <textarea
              name="text"
              required
              rows={4}
              defaultValue={question.text}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Image URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ImageIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                name="imageUrl"
                type="url"
                defaultValue={question.imageUrl ?? ''}
                placeholder="https://example.com/image.png"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Options & Correct Answer */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Options & Correct Answer <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                const optionKey = `option${opt}` as 'optionA' | 'optionB' | 'optionC' | 'optionD'
                return (
                  <div key={opt} className="relative bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="radio"
                        id={`correct-${opt}`}
                        name="correctOption"
                        value={opt}
                        defaultChecked={question.correctOption === opt}
                        required
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                      />
                      <label htmlFor={`correct-${opt}`} className="text-sm font-bold text-gray-700 cursor-pointer">
                        Mark Option {opt} as Correct
                      </label>
                    </div>
                    <input
                      name={`option${opt}`}
                      required
                      defaultValue={question[optionKey]}
                      placeholder={`Option ${opt} text`}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Explanation */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Explanation <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="explanation"
                rows={3}
                defaultValue={question.explanation ?? ''}
                placeholder="Explain why the correct answer is right."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>

            {/* Marks */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Marks <span className="text-red-500">*</span>
              </label>
              <input
                name="marks"
                type="number"
                required
                defaultValue={question.marks}
                min={1}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Changing this will auto-update the exam total marks.
              </p>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
            >
              Save Changes
            </button>
            <Link
              href={`/admin/exams/${exam.id}/questions`}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
