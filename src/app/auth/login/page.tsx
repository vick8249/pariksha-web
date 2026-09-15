'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-indigo-600">
            <BookOpen className="w-7 h-7" />
            Pariksha
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-4">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Log in to continue your exam practice</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Global error */}
          {state?.message && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {state.message}
            </div>
          )}

          <form action={action} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {state?.errors?.email && (
                <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {state?.errors?.password && (
                <p className="text-red-500 text-xs mt-1">{state.errors.password[0]}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in…
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-indigo-600 font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Admin?{' '}
          <Link href="/admin/login" className="text-indigo-600 hover:underline">
            Admin login →
          </Link>
        </p>
      </div>
    </div>
  )
}
