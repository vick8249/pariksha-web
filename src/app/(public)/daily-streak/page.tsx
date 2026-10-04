import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { DailyCalendar } from '@/components/dashboard/DailyCalendar'
import { Trophy, Star, Target, Flame } from 'lucide-react'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Daily Streak Challenges' }

export default async function DailyStreakPage() {
  const session = await requireAuth()

  const [user, completedAttempts] = await Promise.all([
    db.user.findUnique({
      where: { id: session.userId },
      select: { starsEarned: true },
    }),
    db.attempt.findMany({
      where: { userId: session.userId, status: 'COMPLETED' },
      select: { examId: true, percentage: true, exam: { select: { passingScore: true } } },
    }),
  ])

  // Fetch current week's daily exams
  const today = new Date()
  const currentDay = today.getDay()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)) // Monday
  startOfWeek.setHours(0, 0, 0, 0)
  
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday
  endOfWeek.setHours(23, 59, 59, 999)

  const dailyExams = await db.exam.findMany({
    where: {
      isDaily: true,
      isPublished: true,
      scheduledDate: {
        gte: startOfWeek,
        lte: endOfWeek
      }
    },
    orderBy: { scheduledDate: 'asc' },
    include: { subject: { include: { category: true } } }
  })
  
  const completedExamIds = completedAttempts.map(a => a.examId)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Gamification Section */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="md:w-2/3">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest mb-6">
                <Flame className="w-4 h-4 text-amber-200" /> Challenge Arena
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                Build Your Daily Streak.
              </h1>
              <p className="text-amber-100 text-lg md:text-xl font-medium max-w-xl">
                Complete the daily practice test every single day. If you pass, you earn a <strong className="text-white">Golden Star</strong>. Collect stars to prove your consistency.
              </p>
            </div>
            
            {/* Player Stats Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center justify-center gap-6 min-w-[250px]">
              <div className="text-center">
                <div className="text-5xl font-black text-white flex items-center justify-center gap-2 drop-shadow-md">
                  {user?.starsEarned || 0}
                </div>
                <div className="text-amber-100 font-bold uppercase tracking-wider text-xs mt-2">Total Stars</div>
              </div>
              <div className="w-px h-16 bg-white/20" />
              <div className="text-center">
                <div className="text-5xl flex items-center justify-center drop-shadow-md">
                  ⭐
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Calendar component we already built */}
        <DailyCalendar exams={dailyExams} completedIds={completedExamIds} />

        {/* Rules/Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1. Play Daily</h3>
            <p className="text-gray-500 text-sm">A new short test unlocks every day at midnight. Don't miss it!</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2. Pass to Earn</h3>
            <p className="text-gray-500 text-sm">You only earn a star if you score above the passing mark. Try your best.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">3. Collect Stars</h3>
            <p className="text-gray-500 text-sm">Hoard your stars. In the future, top students might unlock special rewards.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
