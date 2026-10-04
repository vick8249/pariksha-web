import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  await requireAdmin()

  const students = await db.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { attempts: true } } },
  })

  const header = ['Name', 'Email', 'Contact No.', 'Class / Category', 'Total Exams Taken', 'Status', 'Joined Date']

  const rows = students.map((s) => [
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.email}"`,
    `"${s.phone ?? ''}"`,
    `"${s.class ?? 'Not specified'}"`,
    s._count.attempts,
    s.isActive ? 'Active' : 'Inactive',
    `"${new Date(s.createdAt).toLocaleDateString('en-IN')}"`,
  ])

  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pariksha-students-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
