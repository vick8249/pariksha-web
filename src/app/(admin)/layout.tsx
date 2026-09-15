import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()
  const admin = await db.user.findUnique({
    where: { id: session.userId },
    select: { name: true },
  })

  return (
    <div className="admin-area flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors text-gray-900 dark:text-gray-100">
      <AdminSidebar adminName={admin?.name ?? 'Admin'} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
