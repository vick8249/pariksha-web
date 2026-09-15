import Link from 'next/link'
import { BookOpen, Globe, Mail, MessageCircle, Video, Code2 } from 'lucide-react'
import { db } from '@/lib/db'

export default async function Footer() {
  // Fetch up to 2 active categories to display dynamically in the footer
  const footerCategories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    take: 2,
    include: {
      subjects: {
        where: { isActive: true },
        take: 4, // Up to 4 subjects per category in footer
        select: { id: true, name: true, slug: true },
      }
    }
  })

  return (
    <footer className="print:hidden bg-[#0A0A0A] text-gray-400 mt-auto border-t border-gray-900/50 relative overflow-hidden">
      {/* Premium Decorative gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-12 lg:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 font-black text-2xl text-white mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Pariksha
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Your trusted, enterprise-grade exam preparation portal. Practice MCQs, take timed tests, and track your progress with advanced analytics.
            </p>
            <div className="flex gap-3 mt-8">
              {[Globe, Mail, MessageCircle, Video].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 text-gray-400 hover:text-white transition-all shadow-sm group">
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Dynamic Categories (up to 2) */}
            {footerCategories.map((cat) => (
              <div key={cat.id}>
                <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">{cat.name}</h3>
                <ul className="space-y-3.5 text-sm">
                  {cat.subjects.length > 0 ? (
                    cat.subjects.map((sub) => (
                      <li key={sub.id}>
                        <Link href={`/category/${cat.slug}`} className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2.5 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-indigo-400 group-hover:scale-150 transition-all" />
                          {sub.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-600 italic">More coming soon...</li>
                  )}
                </ul>
              </div>
            ))}

            {/* If there are no categories, fallback */}
            {footerCategories.length === 0 && (
              <div>
                <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Categories</h3>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            )}

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3.5 text-sm">
                {[
                  { label: 'Browse Exams', href: '/exams' },
                  { label: 'All Categories', href: '/categories' },
                  { label: 'Create Account', href: '/auth/register' },
                  { label: 'Student Dashboard', href: '/dashboard' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2.5 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-indigo-400 group-hover:scale-150 transition-all" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-sm">
          <p className="text-gray-500 font-medium text-center lg:text-left">
            &copy; {new Date().getFullYear()} Pariksha Mandal. All rights reserved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex gap-6 text-gray-500 font-medium">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>

            <div className="hidden sm:block w-px h-4 bg-gray-800" />
            
            {/* Premium Tech Partner Attribution */}
            <a 
              href="https://techageai.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-2 rounded-full border border-gray-700/50 hover:border-indigo-500/50 transition-all shadow-[0_0_15px_rgba(79,70,229,0.05)] hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]"
            >
              <Code2 className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              <span className="text-gray-400 text-xs font-medium">Powered by</span>
              <strong className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">TechAge AI</strong>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
