'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-colors"
    >
      <Printer className="w-4 h-4" />
      Print Certificate
    </button>
  )
}
