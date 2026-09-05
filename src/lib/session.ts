import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export type SessionPayload = {
  userId: string
  role: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN'
  name: string
  email: string
  expiresAt: Date
}

// ─────────────────────────────────────────
// Key
// ─────────────────────────────────────────

const secretKey = process.env.SESSION_SECRET
if (!secretKey) throw new Error('SESSION_SECRET environment variable is not set')
const encodedKey = new TextEncoder().encode(secretKey)

const COOKIE_NAME = 'pariksha-session'
const SESSION_DURATION_DAYS = 7

// ─────────────────────────────────────────
// Encrypt / Decrypt
// ─────────────────────────────────────────

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(encodedKey)
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] })
    return payload as SessionPayload
  } catch {
    return null
  }
}

// ─────────────────────────────────────────
// Session CRUD
// ─────────────────────────────────────────

export async function createSession(data: Omit<SessionPayload, 'expiresAt'>): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)
  const session = await encrypt({ ...data, expiresAt })
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return decrypt(token)
}

export async function updateSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  const session = await decrypt(token)
  if (!session) return
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)
  const newToken = await encrypt({ ...session, expiresAt })
  cookieStore.set(COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
