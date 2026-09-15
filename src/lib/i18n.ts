export type Language = 'en' | 'hi' | 'mr'

const DICTIONARY = {
  en: {
    home: 'Home',
    exams: 'Exams',
    categories: 'Categories',
    dashboard: 'Dashboard',
    logout: 'Logout',
    login: 'Log in',
    getStarted: 'Get Started Free',
    startPracticing: 'Start Practicing Free',
    browseCategories: 'Browse Categories',
    heroTitle1: 'Prepare Smarter.',
    heroTitle2: 'Score Higher.',
    heroSub: 'Practice MCQ tests for Class 6–12, UPSC, SSC, Banking and more. Get instant results, detailed explanations, and track your progress — all for free.',
    latestTests: 'Latest tests',
    featuredExams: 'Featured Exams',
    seeAllExams: 'See all exams',
    howItWorks: 'How Pariksha Works',
    chooseExam: 'Choose Your Exam',
    takeTest: 'Take the Test',
    seeResults: 'See Your Results',
    whyChooseUs: 'Why choose us',
    everythingYouNeed: 'Everything You Need to Ace Your Exam',
    createFreeAccount: 'Create Free Account',
    readyToStart: 'Ready to Start Practicing?',
  },
  hi: {
    home: 'होम',
    exams: 'परीक्षाएं',
    categories: 'श्रेणियां',
    dashboard: 'डैशबोर्ड',
    logout: 'लॉग आउट',
    login: 'लॉग इन करें',
    getStarted: 'मुफ्त शुरू करें',
    startPracticing: 'मुफ्त अभ्यास शुरू करें',
    browseCategories: 'श्रेणियां ब्राउज़ करें',
    heroTitle1: 'स्मार्ट तैयारी करें।',
    heroTitle2: 'अधिक अंक प्राप्त करें।',
    heroSub: 'कक्षा 6–12, UPSC, SSC, बैंकिंग और अन्य के लिए MCQ टेस्ट का अभ्यास करें। तुरंत परिणाम, विस्तृत स्पष्टीकरण और अपनी प्रगति को ट्रैक करें — वह भी बिल्कुल मुफ्त।',
    latestTests: 'नवीनतम परीक्षण',
    featuredExams: 'प्रमुख परीक्षाएं',
    seeAllExams: 'सभी परीक्षाएं देखें',
    howItWorks: 'परीक्षा कैसे काम करती है',
    chooseExam: 'अपनी परीक्षा चुनें',
    takeTest: 'परीक्षण दें',
    seeResults: 'अपने परिणाम देखें',
    whyChooseUs: 'हमें क्यों चुनें',
    everythingYouNeed: 'परीक्षा में सफल होने के लिए आवश्यक सब कुछ',
    createFreeAccount: 'मुफ्त खाता बनाएं',
    readyToStart: 'क्या आप अभ्यास शुरू करने के लिए तैयार हैं?',
  },
  mr: {
    home: 'मुख्यपृष्ठ',
    exams: 'परीक्षा',
    categories: 'श्रेण्या',
    dashboard: 'डॅशबोर्ड',
    logout: 'बाहेर पडा',
    login: 'लॉगिन करा',
    getStarted: 'मोफत सुरू करा',
    startPracticing: 'मोफत सराव सुरू करा',
    browseCategories: 'श्रेण्या ब्राउझ करा',
    heroTitle1: 'स्मार्ट तयारी करा.',
    heroTitle2: 'अधिक गुण मिळवा.',
    heroSub: 'इयत्ता 6 ते 12, UPSC, SSC, बँकिंग आणि बरेच काहीसाठी MCQ चाचण्यांचा सराव करा. त्वरित निकाल, तपशीलवार स्पष्टीकरण मिळवा आणि तुमच्या प्रगतीचा मागोवा घ्या — सर्व काही विनामूल्य.',
    latestTests: 'नवीनतम चाचण्या',
    featuredExams: 'वैशिष्ट्यीकृत परीक्षा',
    seeAllExams: 'सर्व परीक्षा पहा',
    howItWorks: 'परीक्षा कशी कार्य करते',
    chooseExam: 'तुमची परीक्षा निवडा',
    takeTest: 'चाचणी घ्या',
    seeResults: 'तुमचे निकाल पहा',
    whyChooseUs: 'आम्हाला का निवडायचे',
    everythingYouNeed: 'परीक्षेत यश मिळवण्यासाठी आवश्यक सर्व काही',
    createFreeAccount: 'मोफत खाते तयार करा',
    readyToStart: 'सराव सुरू करण्यासाठी तयार आहात?',
  }
}

export function getDictionary(lang: Language = 'en') {
  return DICTIONARY[lang] || DICTIONARY['en']
}

export function translateQuestion(q: any, lang: Language) {
  if (lang === 'en') return q
  
  if (lang === 'hi') {
    return {
      ...q,
      text: q.textHi || q.text,
      optionA: q.optionAHi || q.optionA,
      optionB: q.optionBHi || q.optionB,
      optionC: q.optionCHi || q.optionC,
      optionD: q.optionDHi || q.optionD,
      explanation: q.explanationHi || q.explanation,
    }
  }

  if (lang === 'mr') {
    return {
      ...q,
      text: q.textMr || q.text,
      optionA: q.optionAMr || q.optionA,
      optionB: q.optionBMr || q.optionB,
      optionC: q.optionCMr || q.optionC,
      optionD: q.optionDMr || q.optionD,
      explanation: q.explanationMr || q.explanation,
    }
  }
  
  return q
}
