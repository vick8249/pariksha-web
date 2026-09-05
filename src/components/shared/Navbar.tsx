import Link from 'next/link'
import { getSession } from '@/lib/session'
import { logout } from '@/app/actions/auth'
import { BookOpen, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'

export default async function Navbar() {
  const session = await getSession()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <BookOpen className="w-6 h-6" />
            <span>Pariksha</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/exams" className="hover:text-indigo-600 transition-colors">Exams</Link>
            <Link href="/categories" className="hover:text-indigo-600 transition-colors">Categories</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{session.name.split(' ')[0]}</span>
                </div>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button (static for now) */}
          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
