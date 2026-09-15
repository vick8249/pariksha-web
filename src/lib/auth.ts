import 'server-only'
import { db } from '@/lib/db'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// ─────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.email('Please enter a valid email').trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Must contain at least one letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  class: z.string().optional(),
})

export const LoginSchema = z.object({
  email: z.email('Please enter a valid email').trim(),
  password: z.string().min(1, 'Password is required'),
})

export const AdminLoginSchema = z.object({
  email: z.email('Please enter a valid email').trim(),
  password: z.string().min(1, 'Password is required'),
})

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export type AuthFormState =
  | { errors?: Record<string, string[]>; message?: string; success?: boolean; redirectTo?: string }
  | undefined

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  return db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      class: true,
      avatarUrl: true,
      language: true,
    },
  })
}

/** Require authentication — redirects to login if not authenticated */
export async function requireAuth() {
  const session = await getSession()
  if (!session) redirect('/auth/login')
  return session
}

/** Require admin role */
export async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN') {
    redirect('/')
  }
  return session
}
