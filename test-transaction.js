const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attemptId = 'cmutxpw750001a39v7b6gerxk';
  const attempt = await prisma.attempt.findFirst({
    where: { id: attemptId },
    include: { exam: { include: { questions: true } } }
  });
  
  if (!attempt) return console.log('Attempt not found');
  
  const answerRecords = attempt.exam.questions.map(q => ({
    attemptId,
    questionId: q.id,
    selectedOption: null,
    isCorrect: false,
    marksAwarded: 0
  }));
  
  console.log('Starting transaction for', answerRecords.length, 'questions...');
  
  await prisma.$transaction([
    ...answerRecords.map(ar => 
      prisma.attemptAnswer.upsert({
        where: { attemptId_questionId: { attemptId, questionId: ar.questionId } },
        update: { selectedOption: null, isCorrect: false, marksAwarded: 0 },
        create: { attemptId, questionId: ar.questionId, selectedOption: null, isCorrect: false, marksAwarded: 0 }
      })
    ),
    prisma.attempt.update({
      where: { id: attemptId },
      data: { status: 'COMPLETED', submittedAt: new Date(), score: 0, percentage: 0, timeTaken: 10 }
    })
  ]);
  
  console.log('Success!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
