import { db } from '@/lib/db'
import Link from 'next/link'
import { BookOpen, Clock, Users, Search, ChevronRight } from 'lucide-react'
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
      isDaily: false,
      isPremium: false,
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

  // Group exams by category name for better structured display
  const examsByCategory = exams.reduce((acc, exam) => {
    const catName = exam.subject.category.name
    if (!acc[catName]) acc[catName] = []
    acc[catName].push(exam)
    return acc
  }, {} as Record<string, typeof exams>)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-28">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Practice Library</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            {exams.length} standard mock test{exams.length !== 1 ? 's' : ''} available
          </p>

          {/* Search */}
          <form className="mt-6 flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search practice exams..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white text-sm font-bold px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </form>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            <Link
              href="/exams"
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
                !category
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Tracks
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/exams?category=${cat.slug}`}
                className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
                  category === cat.slug
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Exam Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {exams.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="font-bold text-gray-900 dark:text-white text-xl">No exams found</p>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
              {q ? `No results match your search for "${q}"` : 'No exams have been published yet.'}
            </p>
            {q && (
              <Link href="/exams" className="mt-6 inline-block bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold px-6 py-3 rounded-xl hover:bg-indigo-100 transition-colors">
                Clear Search
              </Link>
            )}
          </div>
        ) : (
          // Grouped by Category rendering (Netflix/Coursera style rows)
          Object.entries(examsByCategory).map(([catName, catExams]) => (
            <div key={catName} className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
                  {catName}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
                {catExams.map((exam) => (
                  <Link
                    key={exam.id}
                    href={`/exam/${exam.id}`}
                    className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-none transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors" />
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <span className="text-[10px] font-black tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                        {exam.subject.name}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors relative z-10">
                      {exam.title}
                    </h3>
                    
                    {exam.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow relative z-10">
                        {exam.description}
                      </p>
                    )}

                    {!exam.description && <div className="flex-grow"></div>}

                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        {exam._count.questions} Qs
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatDuration(exam.duration)}
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                        Start <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
