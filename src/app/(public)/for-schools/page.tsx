import Link from 'next/link'
import { GraduationCap, Phone, MessageCircle, FileText, CheckCircle, Clock, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'For Schools | Pariksha Mandal',
  description: 'Unit test and term exam question papers for Class 1st to 12th.',
}

export default function ForSchoolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-indigo-800/50 blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-indigo-600/30 blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-800/50 border border-indigo-700 backdrop-blur-sm text-indigo-100 font-semibold text-sm mb-8">
            <GraduationCap className="w-4 h-4" /> B2B Institutional Services
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
            Elevate Your School's <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              Assessment Standards.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-indigo-100/90 font-medium leading-relaxed mb-10">
            We provide expertly crafted, completely ready-to-print Unit Test and Term Exam question papers for Class 1st to 12th. Save your teachers' time and ensure flawless academic quality.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FileText, title: 'Class 1st to 12th', desc: 'Comprehensive coverage of all subjects across all grades, perfectly aligned with the latest syllabus.' },
            { icon: ShieldCheck, title: 'Flawless Quality', desc: 'Triple-checked by subject matter experts to ensure zero errors and perfect difficulty balancing.' },
            { icon: Clock, title: 'Ready to Print', desc: 'Delivered in standard formats. Just print and distribute. Save hundreds of hours of typing.' },
          ].map((feat, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <feat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feat.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
          
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 relative z-10">Ready to Order?</h2>
          <p className="text-lg text-gray-500 font-medium mb-10 relative z-10">
            Contact our institutional sales team via Call or WhatsApp to discuss your school's requirements and get a custom quote today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <a href="https://wa.me/918484943107" target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#20bd5a] hover:scale-105 transition-all shadow-lg shadow-green-200 w-full sm:w-auto justify-center">
              <MessageCircle className="w-6 h-6" />
              +91 8484943107
            </a>
            
            <a href="tel:+918275822232" className="flex items-center gap-4 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg shadow-indigo-200 w-full sm:w-auto justify-center">
              <Phone className="w-6 h-6" />
              +91 8275822232
            </a>
          </div>
          
          <div className="mt-10 flex items-center justify-center gap-2 text-sm font-bold text-gray-400">
            <CheckCircle className="w-5 h-5 text-green-500" /> Fast Response Guaranteed
          </div>
        </div>
      </section>
    </div>
  )
}
