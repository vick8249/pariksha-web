import Link from 'next/link'
import { Trophy, Target, Award, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export const metadata = {
  title: 'Scholarship Exams | Pariksha Mandal',
  description: 'Compete in high-stakes exams, win real cash scholarships, and prove your merit.',
}

export default function ScholarshipsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 text-amber-800 font-bold text-sm mb-6 shadow-sm">
            <Trophy className="w-4 h-4 text-amber-600" />
            Coming Soon: Pariksha Tournaments
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-8">
            Compete. Win.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">
              Earn.
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
            Welcome to the future of education. Pay a small entry fee, compete with the brightest minds across the country in live proctored exams, and win real cash scholarships.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Join the Waitlist <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/exams"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              Practice Free Exams
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">How Pariksha Scholarships Work</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:border-amber-200 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-indigo-200">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">1. Enroll & Pay</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                Choose a scholarship exam matching your syllabus. Pay a small entry fee securely using UPI, Cards, or Net Banking.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:border-amber-200 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-amber-200">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">2. Compete Live</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                Take the exam in our strict Anti-Cheat environment. No tab-switching, full-screen enforced. Pure merit.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:border-amber-200 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-emerald-200">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">3. Win Real Money</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                Top rankers take home the massive prize pool. The money is transferred instantly to your bank account.
              </p>
            </div>

          </div>
        </div>

        {/* Security / Anti-cheat Banner */}
        <div className="bg-gray-900 rounded-3xl p-8 md:p-12 border border-gray-800 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
          <div className="relative z-10 md:w-2/3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold mb-4 uppercase tracking-wider text-sm">
              <ShieldCheck className="w-5 h-5" /> Enterprise Grade Security
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              100% Fair Play. <br /> Zero Tolerance for Cheating.
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              When real money is on the line, trust is everything. Our upcoming tournament engine features AI-proctoring, full-screen enforcement, and tab-switch disqualification. May the best mind win.
            </p>
            <div className="flex gap-4">
              <span className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm font-semibold border border-gray-700">Tab Monitoring</span>
              <span className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm font-semibold border border-gray-700">Copy-Paste Blocked</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
