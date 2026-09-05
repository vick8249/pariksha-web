'use client'

import { Trash2 } from 'lucide-react'
import { useActionState } from 'react'

export function DeleteButton({ 
  id, 
  action, 
  confirmMessage = 'Are you sure you want to delete this item?' 
}: { 
  id: string, 
  action: (formData: FormData) => Promise<void>,
  confirmMessage?: string
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
        onClick={(e) => {
          if (!confirm(confirmMessage)) {
            e.preventDefault()
          }
        }}
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </form>
  )
}
