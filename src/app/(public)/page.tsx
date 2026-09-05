import Link from 'next/link'
import { db } from '@/lib/db'
import {
  BookOpen, Clock, Users, Trophy, ArrowRight, Star,
  GraduationCap, Zap, CheckCircle, ChevronRight
} from 'lucide-react'

// ─────────────────────────────────────────
// Stats Section
// ─────────────────────────────────────────
async function getStats() {
  const [totalExams, totalStudents, totalAttempts] = await Promise.all([
    db.exam.count({ where: { isPublished: true } }),
    db.user.count({ where: { role: 'STUDENT' } }),
    db.attempt.count({ where: { status: 'COMPLETED' } }),
  ])
  return { totalExams, totalStudents, totalAttempts }
}

// ─────────────────────────────────────────
// Categories
// ─────────────────────────────────────────
async function getCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: 8,
    include: {
      subjects: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  })
}

// ─────────────────────────────────────────
// Featured Exams
// ─────────────────────────────────────────
async function getFeaturedExams() {
  return db.exam.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      subject: {
        include: { category: true },
      },
      _count: { select: { questions: true, attempts: true } },
    },
  })
}

// ─────────────────────────────────────────
// Category color map
// ─────────────────────────────────────────
const GRADIENT_MAP: Record<string, string> = {
  CLASS: 'gradient-class',
  COMPETITIVE: 'gradient-upsc',
  LANGUAGE: 'gradient-science',
  CUSTOM: 'gradient-default',
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────
export default async function HomePage() {
  const [stats, categories, featuredExams] = await Promise.all([
    getStats(),
    getCategories(),
    getFeaturedExams(),
  ])

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>India&apos;s Smart Exam Practice Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Prepare Smarter.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                Score Higher.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-indigo-200 mb-8 leading-relaxed max-w-2xl">
              Practice MCQ tests for Class 6–12, UPSC, SSC, Banking, and more. 
              Get instant results, detailed explanations, and track your progress — all for free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/exams"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-3.5 rounded-xl text-base transition-all duration-200 hover:scale-105 shadow-lg shadow-amber-500/30"
              >
                Start Practicing Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium px-8 py-3.5 rounded-xl text-base transition-all duration-200"
              >
                Browse Categories
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-2">
                {['bg-blue-400', 'bg-pink-400', 'bg-green-400', 'bg-yellow-400'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-indigo-800`} />
                ))}
              </div>
              <p className="text-sm text-indigo-200">
                <span className="font-bold text-white">{stats.totalStudents.toLocaleString()}+</span> students already practicing
              </p>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gray-50 pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 relative z-10">
            {[
              { label: 'Exams Available', value: `${stats.totalExams}+`, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Students Registered', value: `${stats.totalStudents.toLocaleString()}+`, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Tests Completed', value: `${stats.totalAttempts.toLocaleString()}+`, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Categories', value: `${categories.length}+`, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 card-hover">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-1">Browse by category</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Choose Your Exam Type</h2>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.length === 0 ? (
              <p className="col-span-4 text-center text-gray-400 py-12">No categories yet. Admin can add them from the dashboard.</p>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl p-6 text-white card-hover cursor-pointer"
                >
                  <div className={`absolute inset-0 ${GRADIENT_MAP[cat.type] ?? 'gradient-default'}`} />
                  <div className="relative">
                    <div className="text-3xl mb-3">{cat.iconUrl ?? '📚'}</div>
                    <h3 className="font-bold text-base leading-snug">{cat.name}</h3>
                    <p className="text-xs text-white/70 mt-1">
                      {cat.subjects.length} subject{cat.subjects.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="absolute bottom-3 right-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURED EXAMS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-1">Latest tests</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Exams</h2>
            </div>
            <Link href="/exams" className="hidden sm:flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              See all exams <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredExams.length === 0 ? (
              <p className="col-span-3 text-center text-gray-400 py-12">No exams published yet.</p>
            ) : (
              featuredExams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/exam/${exam.id}`}
                  className="group bg-white border border-gray-200 rounded-2xl p-5 card-hover"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {exam.subject.category.name}
                    </span>
                    {exam.negativeMarking && (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        -ve marks
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {exam.subject.name}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {exam._count.questions} Qs
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {exam.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {exam._count.attempts} attempts
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2">Simple & effective</p>
            <h2 className="text-3xl font-extrabold text-gray-900">How Pariksha Works</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              From browsing to acing your exam — it takes just 3 steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: GraduationCap,
                title: 'Choose Your Exam',
                desc: 'Browse categories, pick your subject, and select a test that matches your level.',
                color: 'text-indigo-600',
                bg: 'bg-indigo-50',
              },
              {
                step: '02',
                icon: Clock,
                title: 'Take the Test',
                desc: 'Answer MCQs in a distraction-free interface with a live timer. Navigate questions freely.',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
              },
              {
                step: '03',
                icon: Star,
                title: 'See Your Results',
                desc: 'Get instant scores, review every question with explanations, and track your progress.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
              },
            ].map(({ step, icon: Icon, title, desc, color, bg }) => (
              <div key={step} className="relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step}
                </div>
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARIKSHA ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider mb-2">Why choose us</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Everything You Need to Ace Your Exam
              </h2>
              <div className="space-y-4">
                {[
                  'Class-wise and subject-wise exam organization',
                  'Instant results with question-by-question explanations',
                  'Timed tests with auto-submit for real exam feel',
                  'Track your score history and see your improvement',
                  'Mobile-friendly — practice anywhere, anytime',
                  'Completely free to use — no hidden charges',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{point}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white">
                  <h3 className="font-bold text-xl mb-4">Sample Question</h3>
                  <p className="text-sm text-indigo-100 mb-5">What is the capital of India?</p>
                  <div className="space-y-2">
                    {['Mumbai', 'New Delhi ✓', 'Kolkata', 'Chennai'].map((opt, i) => (
                      <div
                        key={i}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          opt.includes('✓')
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 text-indigo-100'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/20 text-xs text-indigo-200">
                    ✅ Correct! New Delhi has been the capital of India since 1911.
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-amber-400 rounded-2xl p-4 shadow-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Start Practicing?</h2>
          <p className="text-indigo-200 text-lg mb-8">
            Join thousands of students who are already using Pariksha to prepare smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Register for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/exams"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/50 hover:border-white text-white font-medium px-8 py-3.5 rounded-xl transition-colors"
            >
              Browse Exams
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
