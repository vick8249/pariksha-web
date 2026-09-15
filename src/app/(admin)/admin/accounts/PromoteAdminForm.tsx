'use client'

import { useState } from 'react'
import { promoteToAdmin } from './actions'

export default function PromoteAdminForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await promoteToAdmin(formData)
    
    if (res.error) {
      setMessage({ type: 'error', text: res.error })
    } else if (res.success) {
      setMessage({ type: 'success', text: res.success })
      ;(e.target as HTMLFormElement).reset()
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Registered Email Address</label>
        <input 
          type="email" 
          name="email" 
          required 
          placeholder="teacher@school.com"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      {message && (
        <div className={`text-xs p-2 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
          {message.text}
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? 'Promoting...' : 'Promote to Admin'}
      </button>
    </form>
  )
}
