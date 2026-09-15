'use server'

import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { SignupSchema, LoginSchema, type AuthFormState } from '@/lib/auth'

/** Register a new student */
export async function signup(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    class: formData.get('class'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { name, email, password, class: studentClass } = validated.data

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return { errors: { email: ['An account with this email already exists'] } }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await db.user.create({
    data: { name, email, password: hashedPassword, role: 'STUDENT', class: studentClass },
  })

  await createSession({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  })

  redirect('/')
}

/** Login for students — rejects admin accounts */
export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email, password } = validated.data
  const user = await db.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { message: 'Invalid email or password' }
  }

  if (!user.isActive) {
    return { message: 'Your account has been deactivated. Contact support.' }
  }

  await createSession({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  })

  redirect('/')
}

/** Login exclusively for admins — rejects student accounts */
export async function adminLogin(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email, password } = validated.data
  const user = await db.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { message: 'Invalid email or password' }
  }

  if (!user.isActive) {
    return { message: 'Your account has been deactivated.' }
  }

  // Block non-admin users from accessing the admin login
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return { message: 'Access denied. This login is for admins only.' }
  }

  await createSession({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  })

  redirect('/admin')
}

/** Logout — delete session cookie */
export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/')
}
