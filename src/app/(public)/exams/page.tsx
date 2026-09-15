import { db } from '@/lib/db'
import Link from 'next/link'
import { BookOpen, Clock, Users, Search } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

export const metadata = { title: 'All Exams' }

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; subject?: string }>
}) {
  const { q, category, subject } = await searchParams

  const exams = await db.exam.findMany({
    where: {
      isPublished: true,
      ...(subject ? { subjectId: subject } : {}),
      ...(q
        ? { title: { contains: q, mode: 'insensitive' } }
        : {}),
      ...(category
        ? { subject: { category: { slug: category } } }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      subject: { include: { category: true } },
      _count: { select: { questions: true, attempts: true } },
    },
  })

  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: { id: true, name: true, slug: true },
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900">All Exams</h1>
          <p className="text-gray-500 mt-2">
            {exams.length} exam{exams.length !== 1 ? 's' : ''} available — choose your subject and start practicing
          </p>

          {/* Search */}
          <form className="mt-5 flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search exams…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              href="/exams"
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                !category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/exams?category=${cat.slug}`}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  category === cat.slug
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Exam Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {exams.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-gray-500">No exams found</p>
            <p className="text-sm text-gray-400 mt-1">
              {q ? `No results for "${q}"` : 'No exams have been published yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                href={`/exam/${exam.id}`}
                className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                    {exam.subject.category.name}
                  </span>
                  {exam.negativeMarking && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      -ve marking
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                  {exam.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{exam.subject.name}</p>

                {exam.description && (
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{exam.description}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {exam._count.questions} Questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(exam.duration)}
                  </span>
                  <span className="flex items-center gap-1 ml-auto">
                    <Users className="w-3.5 h-3.5" />
                    {exam._count.attempts}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
