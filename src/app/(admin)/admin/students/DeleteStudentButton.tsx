'use client'

import { useState } from 'react'
import { deleteStudent } from './actions'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteStudentButton({ userId, studentName }: { userId: string, studentName: string }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!window.confirm(`DANGER: Are you absolutely sure you want to permanently delete ${studentName}?\n\nThis will completely erase their account, all their exam attempts, and all their analytics. This action CANNOT be undone.`)) {
      return
    }

    setIsPending(true)
    try {
      await deleteStudent(userId)
      window.alert(`${studentName} has been permanently deleted.`)
      router.push('/admin/students')
    } catch (error) {
      console.error(error)
      window.alert('Failed to delete student. Please try again.')
      setIsPending(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-800 dark:hover:text-red-300 hover:border-red-300 dark:hover:border-red-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete student permanently"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
      Delete Student
    </button>
  )
}
