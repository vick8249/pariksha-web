'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Flag, ChevronLeft, ChevronRight, Send, Clock } from 'lucide-react'
import { formatTime, cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

// ─────────────────────────────────────────
// Types (passed in from server)
// ─────────────────────────────────────────
type Question = {
  id: string
  text: string
  imageUrl: string | null
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  marks: number
}

type Props = {
  attemptId: string
  examId: string
  examTitle: string
  questions: Question[]
  durationSeconds: number
  negativeMarking: boolean
  negativeFactor: number
  savedAnswers?: Record<string, string>
}

type AnswerMap = Record<string, 'A' | 'B' | 'C' | 'D'>
type MarkedMap = Record<string, boolean>

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────
export default function ExamInterface({
  attemptId,
  examId,
  examTitle,
  questions,
  durationSeconds,
  // negativeMarking and negativeFactor are passed so the server-side API route
  // can apply them for scoring. The client UI doesn't need to render them, so we
  // discard them explicitly to satisfy the no-unused-vars lint rule.
  negativeMarking: _nm,
  negativeFactor: _nf,
  savedAnswers = {},
}: Props) {
  void _nm
  void _nf
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>(savedAnswers as AnswerMap)
  const [marked, setMarked] = useState<MarkedMap>({})
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)

  const totalQuestions = questions.length
  const currentQuestion = questions[currentIdx]
  const attempted = Object.keys(answers).length
  const unattempted = totalQuestions - attempted

  // ── Submit ──
  // Declared with useCallback BEFORE the timer effect so it can be safely
  // referenced in the dependency array without a temporal-dead-zone error.
  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      await fetch(`/api/attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      router.push(`/exam/${examId}/result/${attemptId}`)
    } catch {
      setSubmitting(false)
    }
  }, [submitting, attemptId, answers, examId, router])

  // ── Timer ──
  // We use a ref to track whether auto-submit has been triggered so we avoid
  // calling handleSubmit more than once and avoid the setState-in-effect lint rule.
  const autoSubmittedRef = useRef(false)
  useEffect(() => {
    if (timeLeft <= 0) {
      if (!autoSubmittedRef.current) {
        autoSubmittedRef.current = true
        handleSubmit()
      }
      return
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  // ── Auto-save every 15 seconds ──
  const autoSave = useCallback(async () => {
    try {
      await fetch(`/api/attempts/${attemptId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
    } catch {
      // silent fail — answers are in state
    }
  }, [answers, attemptId])

  useEffect(() => {
    autoSaveRef.current = setInterval(autoSave, 15000)
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current)
    }
  }, [autoSave])

  // ── Answer selection ──
  const selectAnswer = (option: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }))
  }

  const clearAnswer = () => {
    setAnswers((prev) => {
      const next = { ...prev }
      delete next[currentQuestion.id]
      return next
    })
  }

  const toggleMark = () => {
    setMarked((prev) => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))
  }

  // ── Timer color ──
  const timerClass =
    timeLeft > 300
      ? 'timer-normal'
      : timeLeft > 60
      ? 'timer-warning'
      : 'timer-danger'

  // ── Option labels ──
  const OPTIONS: Array<{ key: 'A' | 'B' | 'C' | 'D'; text: string }> = [
    { key: 'A', text: currentQuestion.optionA },
    { key: 'B', text: currentQuestion.optionB },
    { key: 'C', text: currentQuestion.optionC },
    { key: 'D', text: currentQuestion.optionD },
  ]

  return (
    <div className="exam-interface min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col pt-24 transition-colors duration-300">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-24 z-30 shadow-sm transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse flex-shrink-0" />
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{examTitle}</span>
        </div>

        {/* Center: Theme Toggle (only visible on large enough screens, or part of controls) */}
        <div className="hidden sm:block">
          <ThemeToggle className="hover:bg-gray-100 dark:hover:bg-gray-800" />
        </div>

        {/* Timer */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timerClass} dark:text-gray-200`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>

          <div className="sm:hidden">
            <ThemeToggle className="w-8 h-8" />
          </div>

          {/* Submit button */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full p-4 gap-4">
        {/* Question Panel */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col shadow-sm transition-colors">
          {/* Question number */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Question <span className="font-bold text-gray-900 dark:text-gray-100">{currentIdx + 1}</span> of {totalQuestions}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
            <div
              className="h-full bg-indigo-500 dark:bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question text */}
          <div className="question-text text-gray-900 dark:text-gray-100 font-medium text-base leading-relaxed mb-4">
            {currentQuestion.text}
          </div>

          {/* Question image */}
          {currentQuestion.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentQuestion.imageUrl}
              alt="Question illustration"
              className="max-w-full max-h-64 object-contain rounded-xl border border-gray-200 dark:border-gray-800 mb-4"
            />
          )}

          {/* Options */}
          <div className="space-y-3 flex-1">
            {OPTIONS.map(({ key, text }) => {
              const selected = answers[currentQuestion.id] === key
              return (
                <button
                  key={key}
                  onClick={() => selectAnswer(key)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-150 flex items-start gap-3',
                    selected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300'
                  )}
                >
                  <span
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                      selected
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {key}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{text}</span>
                </button>
              )
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2">
              <button
                onClick={clearAnswer}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800/50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={toggleMark}
                className={cn(
                  'text-xs flex items-center gap-1 border px-3 py-1.5 rounded-lg transition-colors',
                  marked[currentQuestion.id]
                    ? 'border-amber-400 dark:border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-500 dark:hover:text-amber-400'
                )}
              >
                <Flag className="w-3 h-3" />
                {marked[currentQuestion.id] ? 'Marked' : 'Mark for Review'}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1))}
                disabled={currentIdx === totalQuestions - 1}
                className="flex items-center gap-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 px-3 py-1.5 rounded-lg transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="lg:w-64 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 h-fit lg:sticky lg:top-20 transition-colors">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-3">Question Palette</h3>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Attempted</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 inline-block" /> Not Attempted</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Marked</span>
          </div>

          {/* Dots */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAttempted = !!answers[q.id]
              const isMarked = !!marked[q.id]
              const isCurrent = idx === currentIdx
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={cn('palette-dot', {
                    attempted: isAttempted && !isMarked,
                    marked: isMarked,
                    unattempted: !isAttempted && !isMarked,
                    current: isCurrent,
                    'dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-400': !isAttempted && !isMarked,
                  })}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Attempted</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{attempted}</span>
            </div>
            <div className="flex justify-between">
              <span>Unattempted</span>
              <span className="font-bold text-gray-600 dark:text-gray-300">{unattempted}</span>
            </div>
            <div className="flex justify-between">
              <span>Marked for review</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{Object.values(marked).filter(Boolean).length}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl transition-colors">
            <h3 id="confirm-title" className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">Submit Exam?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              You have answered <strong className="dark:text-white">{attempted}</strong> of <strong className="dark:text-white">{totalQuestions}</strong> questions.
            </p>
            {unattempted > 0 && (
              <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl px-3 py-2 mb-4">
                ⚠️ {unattempted} question{unattempted !== 1 ? 's are' : ' is'} unanswered. Once submitted you cannot go back.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                {submitting ? 'Submitting…' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
