import { db } from '@/lib/db'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = { title: 'Browse Categories | Pariksha' }

const GRADIENT_MAP: Record<string, string> = {
  CLASS: 'from-indigo-500 to-indigo-700',
  COMPETITIVE: 'from-orange-500 to-red-600',
  LANGUAGE: 'from-emerald-500 to-teal-700',
  CUSTOM: 'from-purple-500 to-purple-700',
}

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      subjects: { where: { isActive: true }, select: { id: true } },
      _count: { select: { subjects: true } }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Browse Categories</h1>
          <p className="text-gray-500 mt-2">Choose your area of study to find the right exams</p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500">No categories available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl text-white"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENT_MAP[cat.type] ?? GRADIENT_MAP.CUSTOM}`} />
                <div className="relative p-6">
                  <div className="text-4xl mb-4">{cat.iconUrl ?? '📚'}</div>
                  <h2 className="font-bold text-lg leading-tight mb-1">{cat.name}</h2>
                  {cat.description && (
                    <p className="text-white/70 text-xs line-clamp-2 mb-3">{cat.description}</p>
                  )}
                  <p className="text-white/70 text-sm">
                    {cat.subjects.length} Subject{cat.subjects.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
