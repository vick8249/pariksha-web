import { db } from '@/lib/db'

export const metadata = { title: 'Admin Accounts' }

export default async function AccountsPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Admin Accounts</h1>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden p-6 text-gray-500">
        Manage other admin accounts here.
      </div>
    </div>
  )
}
