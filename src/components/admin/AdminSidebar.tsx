'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, FolderOpen, Tag, Users,
  BarChart3, LogOut, Settings, ChevronRight, GraduationCap, HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/actions/auth'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { label: 'Subjects', href: '/admin/subjects', icon: Tag },
  { label: 'Exams', href: '/admin/exams', icon: BookOpen },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { label: 'Platform Guide', href: '/admin/guide', icon: HelpCircle },
  { label: 'Admin Accounts', href: '/admin/accounts', icon: Settings },
]

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname()

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2.5 font-bold text-lg">
          <GraduationCap className="w-6 h-6 text-indigo-400" />
          <span>Pariksha Admin</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Owner Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-4 h-4 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{adminName}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
        <form action={logout}>
          <button className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-2 rounded-xl hover:bg-gray-800">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
