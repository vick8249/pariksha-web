import { BookOpen, FileText, Upload } from 'lucide-react'

export const metadata = { title: 'Admin Guide' }

export default function AdminGuidePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Pariksha Platform Guide</h1>
        <p className="text-gray-500 mt-2">Everything you need to know to manage your exam portal.</p>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">1. Hierarchy &amp; Structure</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            The platform is organized in a top-down structure. You must create them in this order:
          </p>
          <ul className="space-y-3 text-sm text-gray-600 list-disc pl-5">
            <li><strong>Categories</strong> (e.g., &quot;Class 10&quot;, &quot;UPSC&quot;). These are the main sections of your website.</li>
            <li><strong>Subjects</strong> (e.g., &quot;Science&quot;, &quot;Indian Polity&quot;). Subjects must belong to a Category.</li>
            <li><strong>Exams</strong> (e.g., &quot;Mock Test 1&quot;). Exams must belong to a Subject.</li>
            <li><strong>Questions</strong>. These are added inside an Exam.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
              <Upload className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">2. Creating Exams &amp; Questions</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            When you create an exam, the <strong>Total Marks</strong> start at 0. As you add questions, the system automatically calculates the total marks for the exam based on the marks you assign to each question.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
            <h3 className="font-semibold text-amber-800 mb-2">Bulk CSV Upload</h3>
            <p className="text-sm text-amber-700">
              Download an Excel template, fill in up to hundreds of questions, and upload them all at once on the &quot;Manage Questions&quot; page instead of typing them one by one.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">3. Analytics &amp; Reports</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            The <strong>Reports</strong> tab shows every completed exam attempt in real-time. It automatically calculates percentages and flags whether a student passed or failed based on the <em>Passing Score</em> you set when creating the exam.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4 text-sm text-gray-600">
            <strong>Pro Tip:</strong> An &quot;Export to CSV&quot; button is available so you can download the marksheet and print it.
          </div>
        </section>
      </div>
    </div>
  )
}
