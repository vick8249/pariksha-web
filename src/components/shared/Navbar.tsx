import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const session = await getSession()
  let stars = 0
  
  if (session?.userId) {
    const user = await db.user.findUnique({ where: { id: session.userId }, select: { starsEarned: true } })
    if (user) stars = user.starsEarned
  }

  return <NavbarClient session={session} stars={stars} />
}

export type NavbarSession = Awaited<ReturnType<typeof getSession>>
