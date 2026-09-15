import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { formatDate, getGrade } from '@/lib/utils'
import PrintButton from '@/components/exam/PrintButton'

export const metadata = { title: 'Certificate of Completion' }

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>
}) {
  const { id, attemptId } = await params
  const session = await requireAuth()

  // Fetch the attempt with all nested data we need on the certificate
  const attempt = await db.attempt.findFirst({
    where: { id: attemptId, userId: session.userId, status: 'COMPLETED' },
    include: {
      user: { select: { name: true } },
      exam: {
        include: { subject: { include: { category: true } } },
      },
    },
  })

  // Only show certificate for completed, passing attempts
  if (!attempt) notFound()
  const passed = attempt.percentage >= attempt.exam.passingScore
  if (!passed) notFound()

  const exam = attempt.exam
  const percentage = Math.round(attempt.percentage)
  const grade = getGrade(percentage)
  const completionDate = formatDate(attempt.submittedAt ?? attempt.startedAt)

  return (
    <>
      {/*
       * Print button — only visible on screen, hidden when printing.
       * `print:hidden` is a Tailwind print media utility.
       */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-3">
        <PrintButton />
        <a
          href={`/exam/${id}/result/${attemptId}`}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2.5 rounded-xl shadow transition-colors text-sm"
        >
          ← Back to Results
        </a>
      </div>

      {/*
       * The certificate wrapper.
       * On screen: flex centered.
       * On print: fixed to exact viewport, forcing the browser to print exactly what fits on the page.
       */}
      <div
        className="min-h-[100dvh] bg-gray-100 print:bg-white flex items-center justify-center p-4 md:p-8 pt-24 pb-12 print:fixed print:inset-0 print:p-0 print:m-0 print:block print:w-screen print:h-screen print:overflow-hidden"
        style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' } as React.CSSProperties}
      >
        {/* 
          Certificate Paper (The Container)
          We use \`@container\` so all children can use \`cqw\` (Container Query Width) units.
          This ensures the certificate is 100% proportionally identical on a 320px phone,
          an 896px desktop, and a physically printed A4 PDF page.
        */}
        <div
          className="
            @container
            relative w-full max-w-4xl
            bg-gradient-to-br from-white via-amber-50/20 to-white
            shadow-2xl print:shadow-none
            mx-auto
            print-a4-strict
          "
          style={{ 
            aspectRatio: '1.414 / 1', // standard A4 Landscape ratio
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              @page {
                size: A4 landscape;
                margin: 0 !important;
              }
              body {
                margin: 0;
                padding: 0;
                background-color: white;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .print-a4-strict {
                width: 100vw !important;
                height: 100vh !important;
                max-width: none !important;
                aspect-ratio: auto !important;
                margin: 0 !important;
              }
            }
          `}} />

          {/* ── Outer decorative border ── */}
          <div className="absolute inset-[1.5cqw] border-[0.8cqw] border-double border-amber-600 print:border-amber-600 pointer-events-none z-10 opacity-90" />
          <div className="absolute inset-[2.5cqw] border-[0.2cqw] border-amber-400/50 print:border-amber-400 pointer-events-none z-10" />

          {/* ── Background watermark pattern ── */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
            style={{
              backgroundImage: 'url(/parikshalogo.png)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: '45%',
              printColorAdjust: 'exact',
            } as React.CSSProperties}
          />

          {/* ── Certificate Content ── */}
          <div className="relative z-20 flex flex-col h-full p-[7cqw] text-center justify-between">

            {/* Header row: logo + title */}
            <div className="flex-shrink-0 flex items-center justify-center gap-[2cqw] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/parikshalogo.png"
                alt="Pariksha Mandal"
                className="h-[8cqw] w-auto object-contain drop-shadow-sm"
              />
              <div className="text-left">
                <p className="text-[1.1cqw] font-bold uppercase tracking-[0.3em] text-amber-600 mb-[0.2cqw]">
                  Pariksha Mandal
                </p>
                <h1 className="text-[4cqw] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 leading-tight drop-shadow-sm" style={{ fontFamily: 'Georgia, serif' }}>
                  Certificate of Achievement
                </h1>
              </div>
            </div>

            {/* Body (Flexible space to perfectly center the certificate text) */}
            <div className="flex-1 flex flex-col items-center justify-center w-full my-[1cqw]">
              
              <div className="w-full flex items-center gap-[1.5cqw] mb-[2cqw]">
                <div className="flex-1 h-[0.2cqw] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
                <span className="text-amber-500 text-[1.8cqw] drop-shadow-sm">✦</span>
                <div className="flex-1 h-[0.2cqw] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
              </div>

              <p className="text-[1.4cqw] text-gray-500 uppercase tracking-[0.25em] font-medium mb-[1.5cqw]">
                This is to proudly certify that
              </p>

              <h2
                className="font-extrabold text-gray-900 mb-[1cqw] tracking-tight text-[5cqw]"
                style={{ fontFamily: 'Georgia, serif', textShadow: '1px 1px 2px rgba(0,0,0,0.05)' }}
              >
                {attempt.user.name}
              </h2>

              <p className="text-gray-600 text-[1.4cqw] max-w-[70cqw] leading-relaxed mb-[2cqw]">
                has successfully completed and demonstrated outstanding performance in the examination
              </p>

              <div className="bg-gradient-to-r from-amber-50/50 via-amber-100/50 to-amber-50/50 border border-amber-200/60 rounded-[1cqw] px-[4cqw] py-[1.2cqw] mb-[2.5cqw] shadow-sm">
                <p className="font-extrabold text-gray-900 text-[2cqw] tracking-tight">{exam.title}</p>
              </div>

              <div className="flex items-center justify-center gap-[4cqw] bg-white/60 py-[1.2cqw] px-[4cqw] rounded-[1cqw] border border-gray-100 shadow-sm w-max">
                <div className="text-center">
                  <div className="text-[2.6cqw] font-black text-indigo-700 drop-shadow-sm leading-none">{percentage}%</div>
                  <div className="text-[1cqw] font-bold text-gray-500 mt-[0.5cqw] uppercase tracking-[0.2em]">Score</div>
                </div>
                <div className="w-[0.1cqw] h-[4cqw] bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                <div className="text-center">
                  <div className={`text-[2.2cqw] font-black ${grade.color} drop-shadow-sm leading-none`}>{grade.label}</div>
                  <div className="text-[1cqw] font-bold text-gray-500 mt-[0.5cqw] uppercase tracking-[0.2em]">Grade</div>
                </div>
                <div className="w-[0.1cqw] h-[4cqw] bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                <div className="text-center">
                  <div className="text-[2cqw] font-black text-gray-800 pt-[0.2cqw] drop-shadow-sm leading-none">{Math.round(attempt.score)}<span className="text-[1.4cqw] text-gray-400 font-bold">/{attempt.totalMarks}</span></div>
                  <div className="text-[1cqw] font-bold text-gray-500 mt-[0.5cqw] uppercase tracking-[0.2em]">Marks</div>
                </div>
              </div>

            </div>

            {/* Footer: date + signature line */}
            <div className="flex-shrink-0 w-full flex items-end justify-between px-[2cqw]">
              <div className="text-center pb-[1cqw]">
                <div className="w-[12cqw] h-[0.2cqw] bg-gray-300 mb-[1cqw] mx-auto" />
                <p className="text-[1.2cqw] text-gray-500 font-medium">Date of Completion</p>
                <p className="text-[1.4cqw] font-bold text-gray-800 mt-[0.4cqw]">{completionDate}</p>
              </div>

              {/* Seal */}
              <div className="flex flex-col items-center">
                <div className="w-[9cqw] h-[9cqw] rounded-full border-[0.3cqw] border-amber-500/80 bg-amber-50/30 flex items-center justify-center shadow-md relative overflow-hidden">
                  <div className="absolute inset-[0.2cqw] border-[0.2cqw] border-dashed border-amber-400/60 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/parikshalogo.png"
                    alt="Seal"
                    className="w-[5cqw] h-[5cqw] object-contain drop-shadow-sm z-10"
                  />
                </div>
                <p className="text-[1cqw] font-bold text-amber-700/80 mt-[0.8cqw] uppercase tracking-[0.2em]">Official Seal</p>
              </div>

              <div className="text-center pb-[1cqw]">
                <div className="w-[12cqw] h-[0.2cqw] bg-gray-300 mb-[1cqw] mx-auto" />
                <p className="text-[1.2cqw] text-gray-500 font-medium">Authorised Signature</p>
                <p className="text-[1.4cqw] font-bold text-gray-800 mt-[0.4cqw]">Pariksha Mandal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
