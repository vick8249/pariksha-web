'use client'

import { useState, useTransition } from 'react'
import { Trash2, AlertTriangle, X } from 'lucide-react'

export function DeleteButton({ 
  id, 
  action, 
  confirmMessage = 'Are you sure you want to delete this item?',
  label = 'Delete'
}: { 
  id: string
  action: (formData: FormData) => Promise<void>
  confirmMessage?: string
  label?: string
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const formData = new FormData()
      formData.set('id', id)
      await action(formData)
      setShowConfirm(false)
    })
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
        <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
        <span className="text-xs text-red-700 font-medium whitespace-nowrap">Sure?</span>
        <button
          onClick={handleConfirm}
          disabled={isPending}
          className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded-md disabled:opacity-60 transition-colors"
        >
          {isPending ? '…' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}
