'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import Papa from 'papaparse'
import { bulkCreateQuestions } from '@/app/actions/bulkQuestions'

export function BulkUploadQuestions({ examId }: { examId: string }) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successCount, setSuccessCount] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    setSuccessCount(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data as any[]
          
          // Validate basic structure
          if (rows.length === 0) throw new Error("The CSV file is empty.")
          if (!rows[0].text || !rows[0].correctOption) {
            throw new Error("Invalid CSV format. Missing required columns: 'text' or 'correctOption'.")
          }

          // Format for server
          const questions = rows.map((row, i) => ({
            text: String(row.text || '').trim(),
            optionA: String(row.optionA || row.OptionA || '').trim(),
            optionB: String(row.optionB || row.OptionB || '').trim(),
            optionC: String(row.optionC || row.OptionC || '').trim(),
            optionD: String(row.optionD || row.OptionD || '').trim(),
            correctOption: String(row.correctOption || row.CorrectOption || '').toUpperCase().trim(),
            explanation: String(row.explanation || row.Explanation || '').trim(),
            marks: Number(row.marks || row.Marks) || 1,
          }))

          // Basic Validation
          questions.forEach((q, i) => {
            if (!q.text) throw new Error(`Row ${i + 1}: Missing question text`)
            if (!['A', 'B', 'C', 'D'].includes(q.correctOption)) {
              throw new Error(`Row ${i + 1}: Correct option must be A, B, C, or D. Found: ${q.correctOption}`)
            }
          })

          const res = await bulkCreateQuestions(examId, questions)
          if (res.error) throw new Error(res.error)
          
          setSuccessCount(questions.length)
        } catch (err: any) {
          setError(err.message || "Failed to process the CSV file.")
        } finally {
          setIsUploading(false)
          if (fileInputRef.current) fileInputRef.current.value = ''
        }
      },
      error: (err) => {
        setError(err.message)
        setIsUploading(false)
      }
    })
  }

  const downloadTemplate = () => {
    const csvContent = "text,optionA,optionB,optionC,optionD,correctOption,explanation,marks\nWhat is the capital of France?,Berlin,Madrid,Paris,Rome,C,Paris is the capital.,1\n"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = "Pariksha_Questions_Template.csv"
    a.click()
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Bulk Upload Questions
          </h3>
          <p className="text-xs text-blue-700 mt-1 max-w-xl">
            Save time by uploading 100s of questions at once using our CSV template.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={downloadTemplate}
            className="text-xs font-semibold text-blue-700 bg-white border border-blue-200 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors flex-1 sm:flex-none text-center"
          >
            Download Template
          </button>
          
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label 
            htmlFor="csv-upload"
            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors cursor-pointer flex-1 sm:flex-none text-center flex justify-center items-center gap-2"
          >
            {isUploading ? 'Uploading...' : 'Select CSV File'}
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {successCount && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-lg flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>Successfully imported {successCount} questions! The exam marks have been updated.</p>
        </div>
      )}
    </div>
  )
}
