'use client'

import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Menu, X, LogOut, LayoutDashboard, Globe, ChevronDown, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { NavbarSession } from './Navbar'
import { getDictionary, type Language } from '@/lib/i18n'
import { usePathname } from 'next/navigation'

function LanguageDropdown({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) {
  const [open, setOpen] = useState(false)
  const languages: { code: Language, label: string, name: string }[] = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'hi', label: 'हिं', name: 'हिन्दी' },
    { code: 'mr', label: 'म', name: 'मराठी' }
  ]

  const current = languages.find(l => l.code === lang) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-2xl transition-all shadow-sm border border-gray-200 hover:border-indigo-400 bg-white hover:bg-gray-50 text-gray-800 hover:text-indigo-600 shadow-sm"
      >
        <Globe className="w-4 h-4" />
        {current.label}
        <ChevronDown className="w-4 h-4 opacity-70" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
            <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Language</div>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code)
                  document.cookie = `lang=${l.code};path=/;max-age=31536000`
                  window.location.reload()
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {l.name}
                {lang === l.code && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function NavbarClient({ session }: { session: NavbarSession }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState<Language>('en')
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  
  // Is this the homepage? (Where we have the dark hero)
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll() // trigger on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  useEffect(() => {
    const stored = document.cookie
      .split('; ')
      .find(r => r.startsWith('lang='))
      ?.split('=')[1] as Language | undefined
    if (stored && ['en', 'hi', 'mr'].includes(stored)) {
      setLang(stored)
    }
  }, [])

  const t = getDictionary(lang)
  
  const navClass = 'bg-white/95 backdrop-blur-xl border-gray-200 shadow-xl text-gray-800'

  return (
    <div className="print:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4">
      <header className={`mx-auto w-full max-w-7xl transition-all duration-500 border ${navClass} rounded-2xl mx-4 w-[calc(100%-2rem)] md:mx-auto`}>
        <div className="px-5 sm:px-8">
          <div className="flex items-center justify-between h-20 transition-all duration-500">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/parikshalogo.png"
                alt="Pariksha Mandal Logo"
                className="w-auto h-12 md:h-16 object-contain transition-transform hover:scale-105" 
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10 text-base font-extrabold text-gray-700">
              <Link href="/" className="hover:text-indigo-600 hover:scale-105 transition-all">{t.home}</Link>
              <Link href="/exams" className="hover:text-indigo-600 hover:scale-105 transition-all">{t.exams}</Link>
              <Link href="/categories" className="hover:text-indigo-600 hover:scale-105 transition-all">{t.categories}</Link>
            </nav>

            {/* Desktop Auth + Language */}
            <div className="hidden md:flex items-center gap-5">
              <LanguageDropdown lang={lang} setLang={setLang} />
              {session ? (
                <div className="flex items-center gap-5">
                  <Link href={session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-base font-extrabold transition-all hover:scale-105 text-gray-800 hover:text-indigo-600">
                    <LayoutDashboard className="w-5 h-5" />
                    {session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' ? 'Admin Dashboard' : t.dashboard}
                  </Link>
                  <div className="w-px h-8 bg-gray-300" />
                  <div className="flex items-center gap-2 text-base">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-extrabold text-base border-2 border-indigo-200 shadow-sm">
                      {session.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <form action={logout}>
                    <button type="submit" className="flex items-center gap-1.5 text-base font-extrabold transition-colors hover:scale-105 text-gray-500 hover:text-red-500">
                      <LogOut className="w-5 h-5" />
                      {t.logout}
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="text-base font-extrabold transition-all hover:scale-105 text-gray-800 hover:text-indigo-600">
                    {t.login}
                  </Link>
                  <Link href="/auth/register" className="text-base font-extrabold px-6 py-3 rounded-2xl transition-all shadow-lg hover:scale-105 bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-xl">
                    {t.getStarted}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: language + burger */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageDropdown lang={lang} setLang={setLang} />
              <button
                className="p-2.5 rounded-xl transition-colors shadow-sm bg-gray-100 text-gray-800 hover:bg-gray-200"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl px-5 py-6 space-y-5 rounded-b-2xl shadow-2xl absolute w-full left-0">
            <nav className="flex flex-col gap-3 text-lg font-extrabold text-gray-800">
              <Link href="/" onClick={() => setMobileOpen(false)} className="py-3 hover:text-indigo-600 transition-colors border-b border-gray-100">{t.home}</Link>
              <Link href="/exams" onClick={() => setMobileOpen(false)} className="py-3 hover:text-indigo-600 transition-colors border-b border-gray-100">{t.exams}</Link>
              <Link href="/categories" onClick={() => setMobileOpen(false)} className="py-3 hover:text-indigo-600 transition-colors">{t.categories}</Link>
            </nav>
            <div className="border-t border-gray-100 pt-5 flex flex-col gap-4">
              {session ? (
                <>
                  <Link href={session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-lg font-extrabold text-gray-800 py-2">
                    <LayoutDashboard className="w-6 h-6" /> {session.role === 'ADMIN' || session.role === 'SUPER_ADMIN' ? 'Admin Dashboard' : t.dashboard}
                  </Link>
                  <form action={logout}>
                    <button type="submit" className="flex items-center gap-3 text-lg font-extrabold text-red-500 py-2">
                      <LogOut className="w-6 h-6" /> {t.logout}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="text-lg font-extrabold text-gray-800 py-2">{t.login}</Link>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="bg-indigo-600 text-white text-lg font-extrabold px-5 py-4 rounded-2xl text-center shadow-xl">
                    {t.getStarted}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
