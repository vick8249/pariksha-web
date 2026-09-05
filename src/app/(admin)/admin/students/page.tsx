import { db } from '@/lib/db'
import { Users, Search, GraduationCap } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Students' }

export default async function StudentsPage() {
  const students = await db.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { attempts: true } }
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Students ({students.length})</h1>
          <p className="text-gray-500 mt-1 text-sm">View registered students and their activity</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {students.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-500">No students registered yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Student Info</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Class</th>
                <th className="text-center px-5 py-3 font-semibold text-gray-600">Total Exams Taken</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {student.class ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                        <GraduationCap className="w-3 h-3" /> {student.class}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Not specified</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-semibold text-gray-900">{student._count.attempts}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {formatDate(student.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
