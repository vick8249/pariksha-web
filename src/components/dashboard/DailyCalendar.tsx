'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar as CalendarIcon, CheckCircle, Lock, PlayCircle } from 'lucide-react'

// Define the exam type based on the Prisma query
type DailyExam = {
  id: string
  title: string
  scheduledDate: Date | null
  subject: { name: string, category: { name: string } }
}

export function DailyCalendar({ exams, completedIds }: { exams: DailyExam[], completedIds: string[] }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Generate the 7 days of the current week (Mon-Sun)
  const currentDay = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1))
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  // Map days to exams
  const days = weekDays.map(date => {
    const exam = exams.find(e => 
      e.scheduledDate && 
      new Date(e.scheduledDate).getFullYear() === date.getFullYear() &&
      new Date(e.scheduledDate).getMonth() === date.getMonth() &&
      new Date(e.scheduledDate).getDate() === date.getDate()
    )
    
    const isToday = date.getTime() === today.getTime()
    const isPast = date.getTime() < today.getTime()
    const isFuture = date.getTime() > today.getTime()
    const isCompleted = exam ? completedIds.includes(exam.id) : false
    
    return { date, exam, isToday, isPast, isFuture, isCompleted }
  })

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none mb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Daily Practice Challenges
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Complete one test every day to build your streak!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
        {days.map((day, idx) => {
          const dayName = day.toLocaleDateString('en-US', { weekday: 'short' })
          const dayNum = day.getDate()
          
          if (!day.exam) {
            // No exam scheduled for this day
            return (
              <div key={idx} className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 opacity-50 ${day.isToday ? 'border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{dayName}</span>
                <span className="text-2xl font-black text-gray-300 mt-1 mb-2">{dayNum}</span>
                <span className="text-xs text-gray-400">No Test</span>
              </div>
            )
          }

          if (day.isFuture) {
            // Future locked exam
            return (
              <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 relative overflow-hidden group">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{dayName}</span>
                <span className="text-2xl font-black text-gray-700 dark:text-gray-300 mt-1 mb-2">{dayNum}</span>
                <Lock className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-gray-500 text-center px-2">Unlocks on<br/>{day.date.toLocaleDateString()}</span>
                </div>
              </div>
            )
          }

          if (day.isCompleted) {
            // Completed exam
            return (
              <Link href={`/exam/${day.exam.id}/result`} key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer group">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{dayName}</span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 mb-2">{dayNum}</span>
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">View Result</span>
                </div>
              </Link>
            )
          }

          if (day.isToday) {
            // Today's active exam
            return (
              <Link href={`/exam/${day.exam.id}`} key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all cursor-pointer transform hover:-translate-y-1 shadow-lg shadow-indigo-100 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-2 m-2 bg-red-500 rounded-full animate-ping" />
                <div className="absolute top-0 right-0 w-2 h-2 m-2 bg-red-500 rounded-full" />
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{dayName}</span>
                <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1 mb-2">{dayNum}</span>
                <PlayCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </Link>
            )
          }

          // Past exam (Not completed)
          return (
            <Link href={`/exam/${day.exam.id}`} key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer group relative overflow-hidden">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{dayName}</span>
              <span className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1 mb-2">{dayNum}</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">Missed</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-amber-50 dark:bg-amber-900/80">
                <span className="text-amber-800 dark:text-amber-200 text-[10px] font-bold px-2 text-center leading-tight">Take<br/>Now</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
