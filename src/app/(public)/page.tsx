import Link from 'next/link'
import { db } from '@/lib/db'
import {
  BookOpen, Clock, Users, Trophy, ArrowRight, Star,
  GraduationCap, Zap, CheckCircle, ChevronRight, Target, Brain, Award
} from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { cookies } from 'next/headers'
import { getDictionary, type Language } from '@/lib/i18n'

// ... (stats functions remain the same)
async function getStats() {
  const [totalExams, totalStudents, totalAttempts] = await Promise.all([
    db.exam.count({ where: { isPublished: true } }),
    db.user.count({ where: { role: 'STUDENT' } }),
    db.attempt.count({ where: { status: 'COMPLETED' } }),
  ])
  return { totalExams, totalStudents, totalAttempts }
}

async function getCategories() {
  return db.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: 8,
    include: {
      subjects: { where: { isActive: true }, select: { id: true } },
      _count: { select: { subjects: true } }
    },
  })
}

async function getFeaturedExams() {
  return db.exam.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      subject: { include: { category: true } },
      _count: { select: { questions: true, attempts: true } },
    },
  })
}

// Category descriptions for the "what you'll learn" section
const CATEGORY_INFO: Record<string, { desc: string; facts: string[] }> = {
  CLASS: {
    desc: 'NCERT-aligned MCQ practice for school students from Class 6 to 12.',
    facts: ['Aligned with CBSE & State Board', 'Subject-wise question banks', 'Instant result with explanations'],
  },
  COMPETITIVE: {
    desc: 'Comprehensive preparation material for national competitive examinations.',
    facts: ['UPSC, SSC, Banking & more', 'Previous year pattern questions', 'Negative marking practice'],
  },
  LANGUAGE: {
    desc: 'Strengthen your language skills with grammar, vocabulary, and comprehension tests.',
    facts: ['Hindi, English & more', 'Grammar & vocabulary tests', 'Progressive difficulty levels'],
  },
  CUSTOM: {
    desc: 'Specialized tests curated for specific topics, skills, and institutions.',
    facts: ['Topic-specific deep dives', 'Custom difficulty levels', 'Institution-specific prep'],
  },
}

const GRADIENT_MAP: Record<string, string> = {
  CLASS: 'from-indigo-500 to-indigo-700',
  COMPETITIVE: 'from-orange-500 to-red-600',
  LANGUAGE: 'from-emerald-500 to-teal-700',
  CUSTOM: 'from-purple-500 to-purple-700',
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value || 'en') as Language
  const t = getDictionary(lang)

  const [stats, categories, featuredExams] = await Promise.all([
    getStats(),
    getCategories(),
    getFeaturedExams(),
  ])

  return (
    <div className="relative"> {/* Removed pt-24 */}
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white overflow-hidden min-h-[95vh] flex items-center rounded-b-[3rem] mx-2 shadow-2xl">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        {/* Decorative blobs */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-amber-300">
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>India&apos;s Smart Exam Practice Platform</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                {t.heroTitle1}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400">
                  {t.heroTitle2}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-indigo-200 mb-8 leading-relaxed max-w-xl">
                {t.heroSub}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['✓ Free forever', '✓ Instant results', '✓ EN/HI/MR support', '✓ Certificate on pass'].map(f => (
                  <span key={f} className="text-xs font-medium bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white/80 backdrop-blur-md">
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/exams"
                  className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 hover:scale-105 shadow-xl shadow-amber-500/30"
                >
                  {t.startPracticing}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all duration-200"
                >
                  {t.browseCategories}
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 mt-10">
                <div className="flex -space-x-2">
                  {['bg-blue-400', 'bg-pink-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400'].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-indigo-900 flex items-center justify-center text-white text-xs font-bold`}>
                      {['R', 'P', 'A', 'S', 'M'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-indigo-200">
                  <span className="font-bold text-white">{stats.totalStudents.toLocaleString()}+</span> students already practicing
                </p>
              </div>
            </div>

            {/* Right: Live stats card */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-indigo-300 font-medium">Live Platform Stats</p>
                      <p className="font-bold text-white">Pariksha Mandal</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Exams Available', value: `${stats.totalExams}+`, icon: BookOpen, color: 'text-blue-300' },
                      { label: 'Students', value: `${stats.totalStudents}+`, icon: Users, color: 'text-green-300' },
                      { label: 'Tests Completed', value: `${stats.totalAttempts}+`, icon: Target, color: 'text-amber-300' },
                      { label: 'Categories', value: `${categories.length}`, icon: Award, color: 'text-pink-300' },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className="bg-white/10 rounded-2xl p-4">
                        <Icon className={`w-5 h-5 ${color} mb-2`} />
                        <div className="text-2xl font-extrabold text-white">{value}</div>
                        <div className="text-xs text-indigo-300 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Sample question preview */}
                  <div className="bg-indigo-900/60 rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-indigo-300 mb-1 font-medium">Sample Question</p>
                    <p className="text-sm font-semibold text-white mb-3">What is the capital of India?</p>
                    <div className="space-y-1.5">
                      {['Mumbai', 'New Delhi ✓', 'Kolkata', 'Chennai'].map((opt, i) => (
                        <div key={i} className={`px-3 py-2 rounded-lg text-xs font-medium ${opt.includes('✓') ? 'bg-emerald-500/80 text-white' : 'bg-white/10 text-indigo-200'}`}>
                          {String.fromCharCode(65 + i)}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-amber-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                  100% Free 🎉
                </div>
              </div>
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

      {/* ── STATS STRIP ── */}
      <section className="bg-gray-50 pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 relative z-10">
            {[
              { label: 'Exams Available', value: `${stats.totalExams}+`, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Students Registered', value: `${stats.totalStudents.toLocaleString()}+`, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Tests Completed', value: `${stats.totalAttempts.toLocaleString()}+`, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Categories', value: `${categories.length}+`, icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
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

      {/* ── CATEGORIES with descriptions ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">{t.browseCategories}</p>
              <h2 className="text-4xl font-extrabold text-gray-900">{t.chooseExam}</h2>
              <p className="text-gray-500 mt-3 text-base max-w-2xl">
                Explore our expertly curated categories. Order and availability are hand-picked by our administrative team.
              </p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.length === 0 ? (
              <p className="col-span-3 text-center text-gray-400 py-12">No categories yet. Admin can add them from the dashboard.</p>
            ) : (
              categories.map((cat) => {
                const info = CATEGORY_INFO[cat.type] ?? CATEGORY_INFO.CUSTOM
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="group relative overflow-hidden rounded-[2rem] text-white hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl min-h-[320px] flex flex-col justify-end p-8"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENT_MAP[cat.type] ?? GRADIENT_MAP.CUSTOM}`} />
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-10" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                      backgroundSize: '24px 24px'
                    }} />
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 drop-shadow-md">{cat.iconUrl ?? '📚'}</div>
                      <h3 className="font-extrabold text-2xl leading-snug mb-2">{cat.name}</h3>
                      <p className="text-white/80 text-sm mb-5 leading-relaxed">{info.desc}</p>
                      
                      <div className="space-y-2 mb-6">
                        {info.facts.map(f => (
                          <p key={f} className="text-white/90 text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-white/50" />
                            {f}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <p className="text-white font-bold text-sm bg-white/10 px-3 py-1 rounded-lg">
                          {cat.subjects.length} Subject{cat.subjects.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-1 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                          Explore <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURED EXAMS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">{t.latestTests}</p>
              <h2 className="text-4xl font-extrabold text-gray-900">{t.featuredExams}</h2>
              <p className="text-gray-500 mt-3 text-base">New and highly-rated practice tests added recently.</p>
            </div>
            <Link href="/exams" className="hidden sm:flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              {t.seeAllExams} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExams.length === 0 ? (
              <p className="col-span-3 text-center text-gray-400 py-12">No exams published yet.</p>
            ) : (
              featuredExams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/exam/${exam.id}`}
                  className="group relative bg-white border border-gray-200 rounded-3xl p-6 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                      {exam.subject.category.name}
                    </span>
                    <div className="flex gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                        100% Free
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-extrabold text-gray-900 text-xl leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
                    {exam.title}
                  </h3>
                  
                  <p className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    {exam.subject.name}
                  </p>
                  
                  {exam.description && (
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed flex-1">{exam.description}</p>
                  )}
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100 mt-auto">
                    <div className="flex flex-col items-center justify-center text-center gap-1">
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                      <span className="font-bold">{exam._count.questions} Qs</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1 border-x border-gray-200">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="font-bold">{formatDuration(exam.duration)}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold">{exam._count.attempts} taken</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">Simple & effective</p>
            <h2 className="text-4xl font-extrabold text-gray-900">{t.howItWorks}</h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              From browsing to acing your exam — it takes just 3 easy steps to start your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: '01', icon: GraduationCap,
                title: t.chooseExam,
                desc: 'Browse categories like Class 10, UPSC, SSC or Banking. Pick your subject and select a test that matches your level.',
                color: 'text-indigo-600', bg: 'bg-indigo-50',
              },
              {
                step: '02', icon: Clock,
                title: t.takeTest,
                desc: 'Answer MCQs in a distraction-free interface with a live countdown timer. Skip and revisit questions freely.',
                color: 'text-amber-600', bg: 'bg-amber-50',
              },
              {
                step: '03', icon: Star,
                title: t.seeResults,
                desc: 'Get instant scores, review every question with detailed explanations, track your progress, and earn a certificate.',
                color: 'text-emerald-600', bg: 'bg-emerald-50',
              },
            ].map(({ step, icon: Icon, title, desc, color, bg }) => (
              <div key={step} className="relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 group-hover:bg-indigo-600 transition-colors text-white text-sm font-extrabold rounded-2xl flex items-center justify-center shadow-lg">
                  {step}
                </div>
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl mb-3">{title}</h3>
                <p className="text-gray-500 text-base leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARIKSHA ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">Your Path to Success</p>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
                {t.everythingYouNeed}
              </h2>
              <div className="space-y-5">
                {[
                  'Class-wise and subject-wise exam organization for easy navigation',
                  'Instant results with question-by-question detailed explanations',
                  'Timed tests with auto-submit — just like the real exam experience',
                  'Track your score history and monitor your improvement over time',
                  'Hindi & Marathi language support for all question content',
                  'Certificate of Achievement when you pass an exam',
                  'Mobile-friendly — practice anywhere, anytime on any device',
                  'Completely free to use — no hidden charges, ever',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-base font-medium leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 mt-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-indigo-600/30"
              >
                {t.createFreeAccount} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right: improved preview card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-indigo-200 ml-2 font-medium">Live Exam Interface</span>
                  </div>
                  <p className="text-indigo-200 text-xs font-medium mb-1">Q3 of 30 · Science · Class 10</p>
                  <h3 className="font-bold text-base mb-4">What is the chemical formula of water?</h3>
                  <div className="space-y-2 mb-5">
                    {['CO₂', 'H₂O ✓', 'O₂', 'NaCl'].map((opt, i) => (
                      <div
                        key={i}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                          opt.includes('✓') ? 'bg-emerald-500 text-white' : 'bg-white/10 text-indigo-100'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-white/20 text-xs text-indigo-200">
                    💡 <strong className="text-white">Explanation:</strong> Water is H₂O — two hydrogen atoms bonded to one oxygen atom.
                  </div>
                </div>

                {/* Timer badge */}
                <div className="absolute -top-4 -right-4 bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-xl flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-gray-900 text-sm">24:37</span>
                </div>

                {/* Trophy badge */}
                <div className="absolute -bottom-4 -left-4 bg-amber-400 rounded-2xl p-4 shadow-xl">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white relative overflow-hidden m-2 rounded-3xl shadow-lg">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t.readyToStart}</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg text-base"
            >
              {t.createFreeAccount} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
