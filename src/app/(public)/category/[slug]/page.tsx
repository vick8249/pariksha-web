import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Clock, Users, ChevronRight } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await db.category.findUnique({ where: { slug }, select: { name: true } })
  return { title: category?.name ?? 'Category' }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await db.category.findUnique({
    where: { slug, isActive: true },
    include: {
      subjects: {
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          exams: {
            where: { isPublished: true },
            include: { _count: { select: { questions: true, attempts: true } } },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })

  if (!category) notFound()

  const totalExams = category.subjects.reduce((sum, s) => sum + s.exams.length, 0)

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/categories" className="hover:text-gray-600">Categories</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl text-white p-8 mb-8">
          <div className="text-4xl mb-3">{category.iconUrl ?? '📚'}</div>
          <h1 className="text-3xl font-extrabold">{category.name}</h1>
          {category.description && (
            <p className="text-indigo-200 mt-2">{category.description}</p>
          )}
          <div className="flex gap-4 mt-4 text-sm text-indigo-200">
            <span>{category.subjects.length} subjects</span>
            <span>{totalExams} exams</span>
          </div>
        </div>

        {/* Subjects & Exams */}
        {category.subjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No subjects available in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {category.subjects.map((subject) => (
              <div key={subject.id}>
                <h2 className="font-bold text-gray-900 text-xl mb-4 flex items-center gap-2">
                  {subject.name}
                  <span className="text-sm font-normal text-gray-400">
                    ({subject.exams.length} exam{subject.exams.length !== 1 ? 's' : ''})
                  </span>
                </h2>

                {subject.exams.length === 0 ? (
                  <p className="text-sm text-gray-400 bg-gray-100 rounded-xl px-4 py-3">
                    No exams available for this subject yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subject.exams.map((exam) => (
                      <Link
                        key={exam.id}
                        href={`/exam/${exam.id}`}
                        className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-3 group-hover:text-indigo-600 transition-colors">
                          {exam.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" /> {exam._count.questions} Qs
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {formatDuration(exam.duration)}
                          </span>
                          <span className="flex items-center gap-1 ml-auto">
                            <Users className="w-3.5 h-3.5" /> {exam._count.attempts}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
