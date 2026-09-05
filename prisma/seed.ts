/**
 * Pariksha — Database Seed Script
 * Run with: node prisma/seed.js (or npx tsx prisma/seed.ts)
 *
 * Creates:
 * - 1 Super Admin account
 * - Sample categories (Class 10, UPSC)
 * - Sample subjects
 * - 1 sample exam with 5 questions
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Pariksha database...')

  // ── Admin Account ──
  const adminPassword = await bcrypt.hash('admin@pariksha123', 12)
  const admin = await db.user.upsert({
    where: { email: 'admin@pariksha.com' },
    update: {},
    create: {
      name: 'Pariksha Admin',
      email: 'admin@pariksha.com',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)
  console.log('   Password: admin@pariksha123')

  // ── Categories ──
  const classCategory = await db.category.upsert({
    where: { slug: 'class-10' },
    update: {},
    create: {
      name: 'Class 10',
      nameHi: 'कक्षा 10',
      slug: 'class-10',
      description: 'CBSE / State Board Class 10 exam preparation',
      iconUrl: '📚',
      type: 'CLASS',
      order: 1,
    },
  })

  const upscCategory = await db.category.upsert({
    where: { slug: 'upsc' },
    update: {},
    create: {
      name: 'UPSC Civil Services',
      nameHi: 'यूपीएससी',
      slug: 'upsc',
      description: 'IAS / IPS / IFS exam preparation',
      iconUrl: '🏛️',
      type: 'COMPETITIVE',
      order: 2,
    },
  })
  console.log('✅ Categories created')

  // ── Subjects ──
  const scienceSubject = await db.subject.upsert({
    where: { slug: 'class-10-science' },
    update: {},
    create: {
      name: 'Science',
      slug: 'class-10-science',
      categoryId: classCategory.id,
      order: 1,
    },
  })

  const gkSubject = await db.subject.upsert({
    where: { slug: 'upsc-general-knowledge' },
    update: {},
    create: {
      name: 'General Knowledge',
      slug: 'upsc-general-knowledge',
      categoryId: upscCategory.id,
      order: 1,
    },
  })
  console.log('✅ Subjects created')

  // ── Sample Exam ──
  const sampleExam = await db.exam.upsert({
    where: { id: 'sample-exam-001' },
    update: {},
    create: {
      id: 'sample-exam-001',
      title: 'Class 10 Science — Chapter 1 Quiz',
      description: 'Basic MCQ quiz on Chemical Reactions and Equations',
      subjectId: scienceSubject.id,
      duration: 10,
      totalMarks: 5,
      passingScore: 60,
      negativeMarking: false,
      isPublished: true,
      instructions: 'Read each question carefully before answering.',
    },
  })

  // ── Sample Questions ──
  const questions = [
    {
      text: 'What is the chemical formula of water?',
      optionA: 'H2O2',
      optionB: 'H2O',
      optionC: 'HO',
      optionD: 'H3O',
      correctOption: 'B' as const,
      explanation: 'Water consists of 2 hydrogen atoms and 1 oxygen atom, giving the formula H₂O.',
      marks: 1,
      order: 1,
    },
    {
      text: 'Which of the following is a physical change?',
      optionA: 'Burning of wood',
      optionB: 'Rusting of iron',
      optionC: 'Melting of ice',
      optionD: 'Cooking of food',
      correctOption: 'C' as const,
      explanation: 'Melting of ice is a physical change because the composition of water remains the same (H₂O).',
      marks: 1,
      order: 2,
    },
    {
      text: 'In the equation: 2H₂ + O₂ → 2H₂O, which substance is the reactant?',
      optionA: 'H₂O only',
      optionB: 'H₂ and O₂',
      optionC: 'O₂ only',
      optionD: 'H₂ only',
      correctOption: 'B' as const,
      explanation: 'Reactants are substances that participate in a chemical reaction. Here, H₂ and O₂ are reactants.',
      marks: 1,
      order: 3,
    },
    {
      text: 'What type of reaction is: Fe + CuSO₄ → FeSO₄ + Cu?',
      optionA: 'Decomposition reaction',
      optionB: 'Combination reaction',
      optionC: 'Displacement reaction',
      optionD: 'Double displacement reaction',
      correctOption: 'C' as const,
      explanation: 'Iron displaces copper from copper sulfate solution. This is a single displacement (displacement) reaction.',
      marks: 1,
      order: 4,
    },
    {
      text: 'Which gas is produced when zinc reacts with dilute sulphuric acid?',
      optionA: 'Oxygen',
      optionB: 'Carbon dioxide',
      optionC: 'Hydrogen',
      optionD: 'Nitrogen',
      correctOption: 'C' as const,
      explanation: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑. Hydrogen gas is produced and can be tested with a burning splint.',
      marks: 1,
      order: 5,
    },
  ]

  for (const q of questions) {
    await db.question.upsert({
      where: {
        id: `sq-${q.order}`,
      },
      update: {},
      create: {
        id: `sq-${q.order}`,
        examId: sampleExam.id,
        ...q,
      },
    })
  }
  console.log('✅ Sample exam with 5 questions created')

  console.log('\n🎉 Seeding complete!')
  console.log('\n📌 Admin Login:')
  console.log('   URL: http://localhost:3000/admin/login')
  console.log('   Email: admin@pariksha.com')
  console.log('   Password: admin@pariksha123')
  console.log('\n⚠️  CHANGE THE ADMIN PASSWORD IMMEDIATELY after first login!')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
