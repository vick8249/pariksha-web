import { db } from '@/lib/db'
import { Shield, ShieldAlert, UserCheck } from 'lucide-react'
import PromoteAdminForm from './PromoteAdminForm'

export const metadata = { title: 'Admin Accounts' }

export default async function AccountsPage() {
  const admins = await db.user.findMany({
    where: { role: 'ADMIN' },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Admin Accounts</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage who has access to the owner dashboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Admin Name</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-gray-900">{admin.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{admin.email}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">
                        <Shield className="w-3 h-3" /> Owner
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Add New Admin
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              To add a new admin, they must first register a normal student account on the website. Then, enter their email below to grant them dashboard access.
            </p>
            <PromoteAdminForm />
            
            <div className="mt-5 p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">
                Warning: Anyone you promote will have full control over all exams, questions, and reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
