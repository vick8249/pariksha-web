import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  await requireAdmin()

  const attempts = await db.attempt.findMany({
    where: { status: 'COMPLETED' },
    orderBy: { submittedAt: 'desc' },
    include: {
      user: { select: { name: true, email: true, class: true } },
      exam: { select: { title: true, totalMarks: true, passingScore: true } }
    }
  })

  // CSV Header
  const headers = ['Student Name', 'Email', 'Class', 'Exam', 'Score', 'Total Marks', 'Percentage', 'Passed', 'Date']
  
  // CSV Rows
  const rows = attempts.map(a => [
    `"${a.user.name.replace(/"/g, '""')}"`,
    `"${a.user.email}"`,
    `"${a.user.class || 'N/A'}"`,
    `"${a.exam.title.replace(/"/g, '""')}"`,
    a.score,
    a.exam.totalMarks,
    `${a.percentage}%`,
    a.percentage >= a.exam.passingScore ? 'Yes' : 'No',
    a.submittedAt ? `"${a.submittedAt.toISOString().split('T')[0]}"` : 'Unknown'
  ])

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="pariksha-student-reports.csv"'
    }
  })
}
