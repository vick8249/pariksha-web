'use client'

import { useState } from 'react'
import { resetStudentPassword } from './actions'
import { KeyRound, Loader2 } from 'lucide-react'

export default function ResetPasswordButton({ userId, studentName }: { userId: string, studentName: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleReset = async () => {
    if (!window.confirm(`Are you absolutely sure you want to reset the password for ${studentName}?\n\nThey will be logged out of their current session and will need the new password to log in.`)) {
      return
    }

    setIsPending(true)
    try {
      const result = await resetStudentPassword(userId)
      if (result.success) {
        window.alert(`SUCCESS!\n\nPassword for ${studentName} has been reset to:\n\n${result.tempPassword}\n\nPlease give this temporary password to the student immediately.`)
      }
    } catch (error) {
      console.error(error)
      window.alert('Failed to reset password. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      onClick={handleReset}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 hover:text-amber-800 hover:border-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Reset student password"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
      Reset Password
    </button>
  )
}
