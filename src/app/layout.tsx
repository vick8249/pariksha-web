import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Pariksha',
    default: 'Pariksha — Exam Portal',
  },
  description:
    'Pariksha is a modern online exam portal for school students and competitive exam aspirants. Practice MCQs, take timed tests, and track your progress.',
  keywords: ['exam', 'MCQ', 'online test', 'practice', 'school', 'UPSC', 'SSC', 'pariksha'],
  openGraph: {
    title: 'Pariksha — Exam Portal',
    description: 'Practice MCQs and take timed tests online',
    type: 'website',
  },
}

import { ThemeProvider } from '@/components/shared/ThemeProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="pariksha-theme-v2"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
