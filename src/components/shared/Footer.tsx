import Link from 'next/link'
import { BookOpen, Globe, Mail, MessageCircle, Video } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              Pariksha
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted exam preparation portal. Practice MCQs, take timed tests, and track your progress.
            </p>
            <div className="flex gap-3 mt-4">
              {[Globe, Mail, MessageCircle, Video].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* School Exams */}
          <div>
            <h3 className="font-semibold text-white mb-3">School Exams</h3>
            <ul className="space-y-2 text-sm">
              {['Class 6–8', 'Class 9–10', 'Class 11–12', 'Board Exams'].map(item => (
                <li key={item}>
                  <Link href="/categories" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitive */}
          <div>
            <h3 className="font-semibold text-white mb-3">Competitive Exams</h3>
            <ul className="space-y-2 text-sm">
              {['UPSC / IAS', 'SSC CGL', 'Banking / IBPS', 'Railway / RRB'].map(item => (
                <li key={item}>
                  <Link href="/categories" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'All Exams', href: '/exams' },
                { label: 'Register', href: '/auth/register' },
                { label: 'Log In', href: '/auth/login' },
                { label: 'My Dashboard', href: '/dashboard' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Pariksha. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
