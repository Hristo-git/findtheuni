// Program-level data for FindTheUni
// Each program has requirements, deadlines, ECTS, language, curriculum
// Generated for 256 universities

export const programs = [
  // ═══ БЪЛГАРИЯ (IDs 1-10) ═══
  { id: 1, uniId: 1, name: "Информатика", nameEn: "Computer Science", field: "IT", level: "bachelor", language: "bg", duration: 8, ects: 240, tuitionPerYear: 600, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 4.5, languageCert: null, documents: ["diploma", "transcript", "motivation"], entranceExam: true }, curriculum: ["Алгоритми", "Структури данни", "ООП", "Бази данни", "AI"], careerOutcomes: ["Software Engineer", "Data Scientist"], employability: 88 },
  { id: 2, uniId: 1, name: "Право", nameEn: "Law", field: "Право", level: "bachelor", language: "bg", duration: 10, ects: 300, tuitionPerYear: 600, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 5.0, languageCert: null, documents: ["diploma", "transcript", "motivation"], entranceExam: true }, curriculum: ["Конституционно право", "Наказателно право", "Гражданско право", "Международно право"], careerOutcomes: ["Lawyer", "Judge", "Legal Advisor"], employability: 82 },
  { id: 3, uniId: 1, name: "Медицина", nameEn: "Medicine", field: "Медицина", level: "bachelor", language: "bg", duration: 12, ects: 360, tuitionPerYear: 3200, applicationDeadline: "2026-06-30", startDate: "2026-10-01", requirements: { minGPA: 5.5, languageCert: null, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: true }, curriculum: ["Anatomy", "Physiology", "Pharmacology", "Surgery"], careerOutcomes: ["Doctor", "Surgeon", "Researcher"], employability: 95 },
  { id: 4, uniId: 2, name: "Компютърни науки", nameEn: "Computer Science", field: "IT", level: "bachelor", language: "bg", duration: 8, ects: 240, tuitionPerYear: 500, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 4.0, languageCert: null, documents: ["diploma", "transcript"], entranceExam: true }, curriculum: ["Програмиране", "Електроника", "Мрежи", "Системно програмиране"], careerOutcomes: ["Software Engineer", "Systems Architect"], employability: 85 },
  { id: 5, uniId: 2, name: "Електроинженерство", nameEn: "Electrical Engineering", field: "Инженерство", level: "bachelor", language: "bg", duration: 8, ects: 240, tuitionPerYear: 500, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 4.0, languageCert: null, documents: ["diploma", "transcript"], entranceExam: true }, curriculum: ["Електроника", "Автоматика", "Силова електротехника"], careerOutcomes: ["Electrical Engineer", "Automation Engineer"], employability: 82 },
  { id: 6, uniId: 3, name: "Финанси", nameEn: "Finance", field: "Финанси", level: "bachelor", language: "bg", duration: 8, ects: 240, tuitionPerYear: 550, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 4.0, languageCert: null, documents: ["diploma", "transcript"], entranceExam: true }, curriculum: ["Микроикономика", "Макроикономика", "Финансов мениджмънт", "Банково дело"], careerOutcomes: ["Financial Analyst", "Banker"], employability: 75 },
  { id: 7, uniId: 3, name: "Маркетинг", nameEn: "Marketing", field: "Маркетинг", level: "bachelor", language: "bg", duration: 8, ects: 240, tuitionPerYear: 550, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 3.5, languageCert: null, documents: ["diploma", "transcript"], entranceExam: false }, curriculum: ["Маркетинг", "Реклама", "Потребителско поведение", "Дигитален маркетинг"], careerOutcomes: ["Marketing Manager", "Brand Strategist"], employability: 72 },
  { id: 8, uniId: 4, name: "Обща медицина", nameEn: "General Medicine", field: "Медицина", level: "bachelor", language: "en", duration: 12, ects: 360, tuitionPerYear: 8000, applicationDeadline: "2026-06-15", startDate: "2026-10-01", requirements: { minGPA: 5.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: true }, curriculum: ["Anatomy", "Biochemistry", "Pathology", "Clinical Medicine"], careerOutcomes: ["General Practitioner", "Specialist"], employability: 96 },
  { id: 9, uniId: 4, name: "Фармация", nameEn: "Pharmacy", field: "Фармация", level: "bachelor", language: "bg", duration: 10, ects: 300, tuitionPerYear: 4000, applicationDeadline: "2026-07-01", startDate: "2026-10-01", requirements: { minGPA: 4.5, languageCert: null, documents: ["diploma", "transcript"], entranceExam: true }, curriculum: ["Фармакология", "Фармацевтична химия", "Токсикология"], careerOutcomes: ["Pharmacist", "Pharmaceutical Researcher"], employability: 90 },
  { id: 10, uniId: 5, name: "Графичен дизайн", nameEn: "Graphic Design", field: "Дизайн", level: "bachelor", language: "bg", duration: 8, ects: 240, tuitionPerYear: 3800, applicationDeadline: "2026-08-01", startDate: "2026-10-01", requirements: { minGPA: 3.5, languageCert: null, documents: ["diploma", "transcript", "portfolio"], entranceExam: false }, curriculum: ["Типография", "UI/UX", "Брандинг", "Motion Graphics"], careerOutcomes: ["Graphic Designer", "UX Designer"], employability: 78 },
  { id: 11, uniId: 6, name: "Computer Science", nameEn: "Computer Science", field: "IT", level: "bachelor", language: "en", duration: 8, ects: 240, tuitionPerYear: 6600, applicationDeadline: "2026-05-01", startDate: "2026-09-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: false }, curriculum: ["Algorithms", "Software Engineering", "AI", "Databases"], careerOutcomes: ["Software Engineer", "Data Scientist"], employability: 92 },
  { id: 12, uniId: 6, name: "Business Administration", nameEn: "Business Administration", field: "Бизнес", level: "bachelor", language: "en", duration: 8, ects: 240, tuitionPerYear: 6600, applicationDeadline: "2026-05-01", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Management", "Finance", "Marketing", "Strategy"], careerOutcomes: ["Business Analyst", "Consultant"], employability: 85 },
  { id: 13, uniId: 7, name: "Софтуерно инженерство", nameEn: "Software Engineering", field: "IT", level: "bachelor", language: "bg", duration: 8, ects: 240, tuitionPerYear: 500, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 4.0, languageCert: null, documents: ["diploma", "transcript"], entranceExam: true }, curriculum: ["Web Development", "Databases", "Mobile Apps", "DevOps"], careerOutcomes: ["Software Developer", "DevOps Engineer"], employability: 84 },
  { id: 14, uniId: 8, name: "Информатика", nameEn: "Informatics", field: "IT", level: "bachelor", language: "bg", duration: 8, ects: 240, tuitionPerYear: 500, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 4.0, languageCert: null, documents: ["diploma", "transcript"], entranceExam: true }, curriculum: ["Programming", "Data Structures", "Web Technologies"], careerOutcomes: ["Software Developer", "Web Developer"], employability: 80 },
  { id: 15, uniId: 9, name: "Педагогика", nameEn: "Pedagogy", field: "Педагогика", level: "bachelor", language: "bg", duration: 8, ects: 240, tuitionPerYear: 450, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 3.5, languageCert: null, documents: ["diploma", "transcript"], entranceExam: false }, curriculum: ["Дидактика", "Психология", "Методика", "Практика"], careerOutcomes: ["Teacher", "Education Specialist"], employability: 70 },
  { id: 16, uniId: 10, name: "Медицина", nameEn: "Medicine", field: "Медицина", level: "bachelor", language: "en", duration: 12, ects: 360, tuitionPerYear: 7000, applicationDeadline: "2026-06-15", startDate: "2026-10-01", requirements: { minGPA: 5.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: true }, curriculum: ["Anatomy", "Physiology", "Pathology", "Surgery"], careerOutcomes: ["Doctor", "Surgeon"], employability: 95 },

  // ═══ ГЕРМАНИЯ (IDs 11-19) ═══
  { id: 17, uniId: 11, name: "Informatik BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "de", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 2.5, languageCert: { type: "testdaf", min: 4 }, documents: ["diploma", "transcript", "motivation", "cv"], entranceExam: false }, curriculum: ["Algorithms", "Theoretical CS", "Software Engineering", "AI"], careerOutcomes: ["Software Engineer", "Research Scientist"], employability: 94 },
  { id: 18, uniId: 11, name: "Data Science MSc", nameEn: "Data Science MSc", field: "IT", level: "master", language: "en", duration: 4, ects: 120, tuitionPerYear: 0, applicationDeadline: "2026-05-31", startDate: "2026-10-01", requirements: { minGPA: 2.3, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "cv", "recommendation"], entranceExam: false }, curriculum: ["Machine Learning", "Statistics", "Big Data", "Deep Learning"], careerOutcomes: ["Data Scientist", "ML Engineer"], employability: 96 },
  { id: 19, uniId: 12, name: "Maschinenbau BSc", nameEn: "Mechanical Engineering BSc", field: "Инженерство", level: "bachelor", language: "de", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 2.5, languageCert: { type: "testdaf", min: 4 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Mechanics", "Thermodynamics", "Materials Science", "CAD"], careerOutcomes: ["Mechanical Engineer", "Product Designer"], employability: 92 },
  { id: 20, uniId: 13, name: "Computer Science MSc", nameEn: "Computer Science MSc", field: "IT", level: "master", language: "en", duration: 4, ects: 120, tuitionPerYear: 0, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 2.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "cv"], entranceExam: false }, curriculum: ["Distributed Systems", "AI", "Security", "Cloud Computing"], careerOutcomes: ["Software Architect", "DevOps Engineer"], employability: 93 },
  { id: 21, uniId: 14, name: "Informatik BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "de", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 2.7, languageCert: { type: "testdaf", min: 4 }, documents: ["diploma", "transcript"], entranceExam: false }, curriculum: ["Programming", "Algorithms", "Networks", "Databases"], careerOutcomes: ["Software Developer", "IT Consultant"], employability: 90 },
  { id: 22, uniId: 15, name: "Physics MSc", nameEn: "Physics MSc", field: "Природни науки", level: "master", language: "en", duration: 4, ects: 120, tuitionPerYear: 0, applicationDeadline: "2026-05-15", startDate: "2026-10-01", requirements: { minGPA: 2.3, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: false }, curriculum: ["Quantum Physics", "Particle Physics", "Astrophysics"], careerOutcomes: ["Research Physicist", "Data Scientist"], employability: 85 },
  { id: 23, uniId: 16, name: "BWL BSc", nameEn: "Business Administration BSc", field: "Бизнес", level: "bachelor", language: "de", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 2.3, languageCert: { type: "testdaf", min: 4 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Accounting", "Marketing", "Management", "Economics"], careerOutcomes: ["Business Analyst", "Manager"], employability: 85 },

  // ═══ НИДЕРЛАНДИЯ (IDs 20-27) ═══
  { id: 24, uniId: 20, name: "Aerospace Engineering BSc", nameEn: "Aerospace Engineering BSc", field: "Инженерство", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 2314, applicationDeadline: "2026-01-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation", "cv"], entranceExam: false }, curriculum: ["Aerodynamics", "Propulsion", "Flight Mechanics", "Structures"], careerOutcomes: ["Aerospace Engineer", "Systems Engineer"], employability: 94 },
  { id: 25, uniId: 20, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 2314, applicationDeadline: "2026-05-01", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Algorithms", "Software Engineering", "AI", "Computer Graphics"], careerOutcomes: ["Software Engineer", "Researcher"], employability: 93 },
  { id: 26, uniId: 21, name: "AI BSc", nameEn: "Artificial Intelligence BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 2314, applicationDeadline: "2026-05-01", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Machine Learning", "NLP", "Computer Vision", "Robotics"], careerOutcomes: ["AI Engineer", "ML Researcher"], employability: 95 },
  { id: 27, uniId: 22, name: "International Business BSc", nameEn: "International Business BSc", field: "Бизнес", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 2314, applicationDeadline: "2026-05-01", startDate: "2026-09-01", requirements: { minGPA: 2.8, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["International Management", "Finance", "Marketing", "Strategy"], careerOutcomes: ["Business Consultant", "Export Manager"], employability: 87 },
  { id: 28, uniId: 23, name: "Economics BSc", nameEn: "Economics & Business Economics BSc", field: "Икономика", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 2314, applicationDeadline: "2026-05-01", startDate: "2026-09-01", requirements: { minGPA: 2.8, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Microeconomics", "Macroeconomics", "Econometrics", "Finance"], careerOutcomes: ["Economist", "Financial Analyst"], employability: 86 },

  // ═══ UK (IDs 28-33) ═══
  { id: 29, uniId: 28, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 9250, applicationDeadline: "2026-01-15", startDate: "2026-09-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 7.0 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: false }, curriculum: ["Algorithms", "Machine Learning", "Systems", "Theory"], careerOutcomes: ["Software Engineer", "Researcher"], employability: 96 },
  { id: 30, uniId: 28, name: "Engineering Science MEng", nameEn: "Engineering Science MEng", field: "Инженерство", level: "master", language: "en", duration: 8, ects: 240, tuitionPerYear: 9250, applicationDeadline: "2026-01-15", startDate: "2026-09-01", requirements: { minGPA: 3.8, languageCert: { type: "ielts", min: 7.0 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: true }, curriculum: ["Engineering Mathematics", "Electronics", "Biomedical", "Energy"], careerOutcomes: ["Chartered Engineer", "R&D Lead"], employability: 95 },
  { id: 31, uniId: 29, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 9250, applicationDeadline: "2026-01-15", startDate: "2026-09-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 7.0 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: false }, curriculum: ["Programming", "AI", "Graphics", "Security"], careerOutcomes: ["Software Engineer", "Security Analyst"], employability: 95 },
  { id: 32, uniId: 30, name: "Medicine MBBS", nameEn: "Medicine MBBS", field: "Медицина", level: "bachelor", language: "en", duration: 12, ects: 360, tuitionPerYear: 9250, applicationDeadline: "2026-01-15", startDate: "2026-09-01", requirements: { minGPA: 3.8, languageCert: { type: "ielts", min: 7.0 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: true }, curriculum: ["Anatomy", "Pharmacology", "Clinical Skills", "Surgery"], careerOutcomes: ["Doctor", "Surgeon", "Researcher"], employability: 97 },
  { id: 33, uniId: 31, name: "Economics BSc", nameEn: "Economics BSc", field: "Икономика", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 9250, applicationDeadline: "2026-01-15", startDate: "2026-09-01", requirements: { minGPA: 3.7, languageCert: { type: "ielts", min: 7.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Microeconomics", "Macroeconomics", "Econometrics", "Game Theory"], careerOutcomes: ["Economist", "Investment Banker"], employability: 94 },

  // ═══ ФРАНЦИЯ (IDs 34-40) ═══
  { id: 34, uniId: 34, name: "Informatique BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "fr", duration: 6, ects: 180, tuitionPerYear: 170, applicationDeadline: "2026-03-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "delf", min: "B2" }, documents: ["diploma", "transcript", "motivation", "cv"], entranceExam: false }, curriculum: ["Algorithmique", "Systèmes", "Réseaux", "IA"], careerOutcomes: ["Développeur", "Data Scientist"], employability: 88 },
  { id: 35, uniId: 35, name: "Engineering MSc", nameEn: "Engineering MSc", field: "Инженерство", level: "master", language: "en", duration: 4, ects: 120, tuitionPerYear: 600, applicationDeadline: "2026-03-15", startDate: "2026-09-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "cv", "recommendation"], entranceExam: true }, curriculum: ["Applied Math", "Physics", "Data Science", "Engineering Design"], careerOutcomes: ["Engineer", "R&D Scientist"], employability: 95 },

  // ═══ ШВЕЙЦАРИЯ (IDs 41-45) ═══
  { id: 36, uniId: 41, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 1300, applicationDeadline: "2026-04-30", startDate: "2026-09-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "cv"], entranceExam: true }, curriculum: ["Algorithms", "Systems", "Theory of Computation", "AI"], careerOutcomes: ["Software Engineer", "Research Scientist"], employability: 96 },
  { id: 37, uniId: 42, name: "Data Science MSc", nameEn: "Data Science MSc", field: "IT", level: "master", language: "en", duration: 4, ects: 120, tuitionPerYear: 1300, applicationDeadline: "2026-04-15", startDate: "2026-09-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "cv", "recommendation"], entranceExam: false }, curriculum: ["Machine Learning", "Statistics", "Computer Vision", "NLP"], careerOutcomes: ["Data Scientist", "ML Engineer"], employability: 95 },

  // ═══ ИТАЛИЯ (IDs 46-50) ═══
  { id: 38, uniId: 46, name: "Design BSc", nameEn: "Design BSc", field: "Дизайн", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 3900, applicationDeadline: "2026-07-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "portfolio", "motivation"], entranceExam: true }, curriculum: ["Product Design", "Visual Communication", "Interior Design"], careerOutcomes: ["Product Designer", "UX Designer"], employability: 82 },
  { id: 39, uniId: 47, name: "Architecture BSc", nameEn: "Architecture BSc", field: "Архитектура", level: "bachelor", language: "it", duration: 6, ects: 180, tuitionPerYear: 2500, applicationDeadline: "2026-07-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: null, documents: ["diploma", "transcript", "portfolio", "motivation"], entranceExam: true }, curriculum: ["Architectural Design", "Urban Planning", "Structural Engineering"], careerOutcomes: ["Architect", "Urban Planner"], employability: 80 },

  // ═══ ИСПАНИЯ (IDs 51-55) ═══
  { id: 40, uniId: 51, name: "Computer Engineering BSc", nameEn: "Computer Engineering BSc", field: "IT", level: "bachelor", language: "es", duration: 8, ects: 240, tuitionPerYear: 1500, applicationDeadline: "2026-06-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: null, documents: ["diploma", "transcript", "motivation"], entranceExam: true }, curriculum: ["Programming", "Networks", "AI", "Software Engineering"], careerOutcomes: ["Software Engineer", "IT Consultant"], employability: 84 },
  { id: 41, uniId: 52, name: "Business Administration BSc", nameEn: "Business Administration BSc", field: "Бизнес", level: "bachelor", language: "en", duration: 8, ects: 240, tuitionPerYear: 2000, applicationDeadline: "2026-06-15", startDate: "2026-09-01", requirements: { minGPA: 2.8, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Management", "Finance", "Entrepreneurship", "Strategy"], careerOutcomes: ["Business Manager", "Entrepreneur"], employability: 82 },

  // ═══ СКАНДИНАВИЯ ═══
  // Швеция
  { id: 42, uniId: 36, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-01-15", startDate: "2026-08-28", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Algorithms", "AI", "HCI", "Software Engineering"], careerOutcomes: ["Software Developer", "UX Engineer"], employability: 92 },
  { id: 43, uniId: 37, name: "Engineering Physics BSc", nameEn: "Engineering Physics BSc", field: "Инженерство", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-01-15", startDate: "2026-08-28", requirements: { minGPA: 3.2, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Quantum Mechanics", "Thermodynamics", "Signal Processing"], careerOutcomes: ["Physicist", "Engineer"], employability: 90 },
  // Дания
  { id: 44, uniId: 38, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-03-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Algorithms", "Data Science", "Systems Design"], careerOutcomes: ["Software Engineer", "Data Analyst"], employability: 91 },
  { id: 45, uniId: 39, name: "Biotechnology BSc", nameEn: "Biotechnology BSc", field: "Природни науки", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-03-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Molecular Biology", "Genetics", "Bioengineering"], careerOutcomes: ["Biotechnologist", "Researcher"], employability: 86 },
  // Норвегия
  { id: 46, uniId: 40, name: "Informatics BSc", nameEn: "Informatics BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-04-15", startDate: "2026-08-15", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Programming", "AI", "Data Science", "Security"], careerOutcomes: ["Software Developer", "Security Analyst"], employability: 90 },
  // Финландия
  { id: 47, uniId: 43, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-01-20", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: true }, curriculum: ["Algorithms", "Machine Learning", "Networking", "Security"], careerOutcomes: ["Software Engineer", "IT Architect"], employability: 91 },
  { id: 48, uniId: 44, name: "Information Technology BSc", nameEn: "Information Technology BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-01-20", startDate: "2026-09-01", requirements: { minGPA: 2.8, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Web Development", "UX Design", "Mobile Development"], careerOutcomes: ["Full-Stack Developer", "UX Designer"], employability: 88 },

  // ═══ БЕЛГИЯ ═══
  { id: 49, uniId: 24, name: "Engineering BSc", nameEn: "Engineering BSc", field: "Инженерство", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 900, applicationDeadline: "2026-03-01", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: true }, curriculum: ["Mathematics", "Physics", "Engineering Design", "Electronics"], careerOutcomes: ["Engineer", "Project Manager"], employability: 92 },
  { id: 50, uniId: 25, name: "Business Engineering BSc", nameEn: "Business Engineering BSc", field: "Бизнес", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 900, applicationDeadline: "2026-03-01", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Business Strategy", "Finance", "Operations", "Technology"], careerOutcomes: ["Business Analyst", "Consultant"], employability: 90 },

  // ═══ ИРЛАНДИЯ ═══
  { id: 51, uniId: 61, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 8, ects: 240, tuitionPerYear: 5000, applicationDeadline: "2026-02-01", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Algorithms", "AI", "Networks", "Software Engineering"], careerOutcomes: ["Software Engineer", "Data Scientist"], employability: 93 },
  { id: 52, uniId: 62, name: "Business BSc", nameEn: "Business BSc", field: "Бизнес", level: "bachelor", language: "en", duration: 8, ects: 240, tuitionPerYear: 5000, applicationDeadline: "2026-02-01", startDate: "2026-09-01", requirements: { minGPA: 2.8, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Accounting", "Management", "Marketing", "Finance"], careerOutcomes: ["Business Manager", "Accountant"], employability: 88 },

  // ═══ АВСТРИЯ ═══
  { id: 53, uniId: 63, name: "Rechtswissenschaften", nameEn: "Law", field: "Право", level: "bachelor", language: "de", duration: 8, ects: 240, tuitionPerYear: 0, applicationDeadline: "2026-09-05", startDate: "2026-10-01", requirements: { minGPA: 3.0, languageCert: { type: "testdaf", min: 4 }, documents: ["diploma", "transcript"], entranceExam: false }, curriculum: ["Constitutional Law", "Civil Law", "European Law", "International Law"], careerOutcomes: ["Lawyer", "Legal Advisor"], employability: 84 },
  { id: 54, uniId: 64, name: "Informatik BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "de", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-09-05", startDate: "2026-10-01", requirements: { minGPA: 3.0, languageCert: { type: "testdaf", min: 4 }, documents: ["diploma", "transcript"], entranceExam: false }, curriculum: ["Algorithms", "Logic", "Distributed Systems", "AI"], careerOutcomes: ["Software Engineer", "Systems Architect"], employability: 92 },

  // ═══ ПОЛША ═══
  { id: 55, uniId: 55, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 3000, applicationDeadline: "2026-07-01", startDate: "2026-10-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Programming", "Algorithms", "AI", "Databases"], careerOutcomes: ["Software Developer", "IT Specialist"], employability: 85 },
  { id: 56, uniId: 56, name: "Mechanical Engineering BSc", nameEn: "Mechanical Engineering BSc", field: "Инженерство", level: "bachelor", language: "en", duration: 7, ects: 210, tuitionPerYear: 3000, applicationDeadline: "2026-07-01", startDate: "2026-10-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 5.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Mechanics", "Thermodynamics", "Materials", "CAD/CAM"], careerOutcomes: ["Mechanical Engineer", "Product Designer"], employability: 83 },

  // ═══ ЧЕХИЯ ═══
  { id: 57, uniId: 57, name: "Software Engineering BSc", nameEn: "Software Engineering BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 4500, applicationDeadline: "2026-04-30", startDate: "2026-10-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Programming", "Software Design", "Databases", "Web Development"], careerOutcomes: ["Software Developer", "Tech Lead"], employability: 87 },
  { id: 58, uniId: 58, name: "Medicine", nameEn: "General Medicine", field: "Медицина", level: "bachelor", language: "en", duration: 12, ects: 360, tuitionPerYear: 12000, applicationDeadline: "2026-02-28", startDate: "2026-10-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: true }, curriculum: ["Anatomy", "Physiology", "Pathology", "Clinical Medicine"], careerOutcomes: ["Doctor", "Surgeon"], employability: 94 },

  // ═══ ПОРТУГАЛИЯ ═══
  { id: 59, uniId: 59, name: "Engineering BSc", nameEn: "Engineering BSc", field: "Инженерство", level: "bachelor", language: "pt", duration: 6, ects: 180, tuitionPerYear: 700, applicationDeadline: "2026-06-30", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: null, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Mechanical Engineering", "Civil Engineering", "Electronics"], careerOutcomes: ["Engineer", "Project Manager"], employability: 80 },
  { id: 60, uniId: 60, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 700, applicationDeadline: "2026-06-30", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Algorithms", "Web Development", "AI", "Data Science"], careerOutcomes: ["Software Developer", "Data Analyst"], employability: 82 },

  // ═══ ГЪРЦИЯ ═══
  { id: 61, uniId: 53, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 8, ects: 240, tuitionPerYear: 0, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 2.5, languageCert: { type: "ielts", min: 5.5 }, documents: ["diploma", "transcript"], entranceExam: false }, curriculum: ["Programming", "Networks", "AI", "Databases"], careerOutcomes: ["Software Developer", "IT Specialist"], employability: 78 },

  // ═══ РУМЪНИЯ ═══
  { id: 62, uniId: 54, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 8, ects: 240, tuitionPerYear: 3000, applicationDeadline: "2026-07-15", startDate: "2026-10-01", requirements: { minGPA: 2.5, languageCert: { type: "ielts", min: 5.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Programming", "Algorithms", "Databases", "Web Development"], careerOutcomes: ["Software Developer", "IT Consultant"], employability: 82 },

  // ═══ ХЪРВАТИЯ ═══
  { id: 63, uniId: 65, name: "Medicine", nameEn: "Medicine", field: "Медицина", level: "bachelor", language: "en", duration: 12, ects: 360, tuitionPerYear: 9000, applicationDeadline: "2026-07-01", startDate: "2026-10-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: true }, curriculum: ["Anatomy", "Physiology", "Pathology", "Surgery"], careerOutcomes: ["Doctor", "Surgeon"], employability: 88 },

  // ═══ СЪРБИЯ ═══
  { id: 64, uniId: 66, name: "Electrical Engineering BSc", nameEn: "Electrical Engineering BSc", field: "Инженерство", level: "bachelor", language: "en", duration: 8, ects: 240, tuitionPerYear: 2500, applicationDeadline: "2026-07-01", startDate: "2026-10-01", requirements: { minGPA: 2.5, languageCert: { type: "ielts", min: 5.5 }, documents: ["diploma", "transcript"], entranceExam: false }, curriculum: ["Electronics", "Power Systems", "Automation", "Telecommunications"], careerOutcomes: ["Electrical Engineer", "Telecom Specialist"], employability: 78 },

  // ═══ УНГАРИЯ ═══
  { id: 65, uniId: 67, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 4000, applicationDeadline: "2026-06-30", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 5.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Algorithms", "AI", "Software Development", "Databases"], careerOutcomes: ["Software Developer", "Data Scientist"], employability: 82 },
  { id: 66, uniId: 68, name: "Architecture BSc", nameEn: "Architecture BSc", field: "Архитектура", level: "bachelor", language: "en", duration: 10, ects: 300, tuitionPerYear: 3500, applicationDeadline: "2026-06-30", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "portfolio", "motivation"], entranceExam: false }, curriculum: ["Design Studio", "Urban Planning", "Structural Engineering"], careerOutcomes: ["Architect", "Urban Designer"], employability: 80 },

  // ═══ EXPANDED UNIVERSITIES (71-259) — Top European programs ═══
  // Швейцария
  { id: 67, uniId: 71, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 1300, applicationDeadline: "2026-04-30", startDate: "2026-09-15", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "cv"], entranceExam: true }, curriculum: ["Algorithms", "Systems Programming", "Theory", "AI"], careerOutcomes: ["Software Engineer", "Researcher"], employability: 96 },
  { id: 68, uniId: 72, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 1300, applicationDeadline: "2026-04-15", startDate: "2026-09-15", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "cv"], entranceExam: false }, curriculum: ["Machine Learning", "Robotics", "Computer Vision", "NLP"], careerOutcomes: ["ML Engineer", "Robotics Engineer"], employability: 95 },
  // Швеция
  { id: 69, uniId: 73, name: "Computer Science MSc", nameEn: "Computer Science MSc", field: "IT", level: "master", language: "en", duration: 4, ects: 120, tuitionPerYear: 0, applicationDeadline: "2026-01-15", startDate: "2026-08-28", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "cv"], entranceExam: false }, curriculum: ["Distributed Systems", "Security", "AI", "HCI"], careerOutcomes: ["Software Architect", "Security Engineer"], employability: 93 },
  // UK
  { id: 70, uniId: 74, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 9250, applicationDeadline: "2026-01-15", startDate: "2026-09-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: false }, curriculum: ["AI", "Cybersecurity", "Data Science", "Robotics"], careerOutcomes: ["Software Engineer", "Cyber Security Analyst"], employability: 92 },
  // Белгия
  { id: 71, uniId: 75, name: "Engineering BSc", nameEn: "Engineering BSc", field: "Инженерство", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 900, applicationDeadline: "2026-03-01", startDate: "2026-09-15", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: true }, curriculum: ["Engineering Mathematics", "Electronics", "Mechanics", "Computer Science"], careerOutcomes: ["Engineer", "Researcher"], employability: 94 },
  // Дания
  { id: 72, uniId: 76, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-03-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Programming", "Algorithms", "Machine Learning", "HCI"], careerOutcomes: ["Software Developer", "UX Researcher"], employability: 92 },
  // Ирландия
  { id: 73, uniId: 77, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 8, ects: 240, tuitionPerYear: 5000, applicationDeadline: "2026-02-01", startDate: "2026-09-01", requirements: { minGPA: 3.3, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: false }, curriculum: ["AI", "Software Engineering", "Networks", "Graphics"], careerOutcomes: ["Software Engineer", "Game Developer"], employability: 92 },
  // Нидерландия
  { id: 74, uniId: 78, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 2314, applicationDeadline: "2026-05-01", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Algorithms", "AI", "Quantum Computing", "Software Design"], careerOutcomes: ["Software Engineer", "Quantum Computing Researcher"], employability: 94 },
  { id: 75, uniId: 79, name: "Economics BSc", nameEn: "Economics BSc", field: "Икономика", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 9250, applicationDeadline: "2026-01-15", startDate: "2026-09-01", requirements: { minGPA: 3.7, languageCert: { type: "ielts", min: 7.0 }, documents: ["diploma", "transcript", "motivation", "recommendation"], entranceExam: false }, curriculum: ["Microeconomics", "Macroeconomics", "Econometrics", "Finance"], careerOutcomes: ["Economist", "Investment Banker"], employability: 94 },
  // Франция
  { id: 76, uniId: 80, name: "Engineering MSc", nameEn: "Engineering MSc", field: "Инженерство", level: "master", language: "en", duration: 4, ects: 120, tuitionPerYear: 600, applicationDeadline: "2026-03-15", startDate: "2026-09-01", requirements: { minGPA: 3.5, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation", "cv", "recommendation"], entranceExam: true }, curriculum: ["Applied Mathematics", "Physics", "Data Science"], careerOutcomes: ["Engineer", "R&D Manager"], employability: 95 },
  // Нидерландия
  { id: 77, uniId: 81, name: "AI BSc", nameEn: "Artificial Intelligence BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 2314, applicationDeadline: "2026-05-01", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Machine Learning", "NLP", "Cognitive Science", "Robotics"], careerOutcomes: ["AI Engineer", "NLP Specialist"], employability: 93 },
  { id: 78, uniId: 82, name: "Data Science BSc", nameEn: "Data Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 2314, applicationDeadline: "2026-05-01", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Statistics", "Machine Learning", "Big Data", "Visualization"], careerOutcomes: ["Data Scientist", "ML Engineer"], employability: 94 },
  // Франция Sorbonne
  { id: 79, uniId: 83, name: "Sciences BSc", nameEn: "Sciences BSc", field: "Природни науки", level: "bachelor", language: "fr", duration: 6, ects: 180, tuitionPerYear: 170, applicationDeadline: "2026-03-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "delf", min: "B2" }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Mathematics", "Physics", "Chemistry", "Computer Science"], careerOutcomes: ["Researcher", "Teacher"], employability: 82 },
  // Дания Aarhus
  { id: 80, uniId: 85, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 0, applicationDeadline: "2026-03-15", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Algorithms", "Data Structures", "AI", "Databases"], careerOutcomes: ["Software Developer", "Data Engineer"], employability: 91 },
  // Полша Warsaw
  { id: 81, uniId: 86, name: "Computer Science BSc", nameEn: "Computer Science BSc", field: "IT", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 3000, applicationDeadline: "2026-07-01", startDate: "2026-10-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 5.5 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Algorithms", "AI", "Logic", "Software Engineering"], careerOutcomes: ["Software Developer", "System Administrator"], employability: 84 },
  // Португалия Porto
  { id: 82, uniId: 87, name: "Engineering BSc", nameEn: "Engineering BSc", field: "Инженерство", level: "bachelor", language: "en", duration: 6, ects: 180, tuitionPerYear: 700, applicationDeadline: "2026-06-30", startDate: "2026-09-01", requirements: { minGPA: 3.0, languageCert: { type: "ielts", min: 6.0 }, documents: ["diploma", "transcript", "motivation"], entranceExam: false }, curriculum: ["Mechanical Engineering", "Civil Engineering", "Computer Engineering"], careerOutcomes: ["Engineer", "Project Manager"], employability: 83 },

  // ═══ BATCH — generate remaining programs for expanded universities ═══
  // Each expanded university gets 1 program based on its primary field
  ...generateExpandedPrograms()
];

// Helper to generate programs for remaining expanded universities (88-259)
function generateExpandedPrograms() {
  // Import would cause circular dependency, so use inline data
  const countryDefaults = {
    'Швейцария': { deadline: '2026-04-30', tuition: 1300, lang: 'en', cert: { type: 'ielts', min: 6.5 } },
    'Германия': { deadline: '2026-07-15', tuition: 0, lang: 'de', cert: { type: 'testdaf', min: 4 } },
    'Нидерландия': { deadline: '2026-05-01', tuition: 2314, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'UK': { deadline: '2026-01-15', tuition: 9250, lang: 'en', cert: { type: 'ielts', min: 6.5 } },
    'Франция': { deadline: '2026-03-15', tuition: 170, lang: 'fr', cert: { type: 'delf', min: 'B2' } },
    'Швеция': { deadline: '2026-01-15', tuition: 0, lang: 'en', cert: { type: 'ielts', min: 6.5 } },
    'Дания': { deadline: '2026-03-15', tuition: 0, lang: 'en', cert: { type: 'ielts', min: 6.5 } },
    'Норвегия': { deadline: '2026-04-15', tuition: 0, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Финландия': { deadline: '2026-01-20', tuition: 0, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Белгия': { deadline: '2026-03-01', tuition: 900, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Ирландия': { deadline: '2026-02-01', tuition: 5000, lang: 'en', cert: { type: 'ielts', min: 6.5 } },
    'Австрия': { deadline: '2026-09-05', tuition: 0, lang: 'de', cert: { type: 'testdaf', min: 4 } },
    'Испания': { deadline: '2026-06-15', tuition: 1500, lang: 'es', cert: null },
    'Италия': { deadline: '2026-07-15', tuition: 2500, lang: 'it', cert: null },
    'Полша': { deadline: '2026-07-01', tuition: 3000, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Чехия': { deadline: '2026-04-30', tuition: 4500, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Португалия': { deadline: '2026-06-30', tuition: 700, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Гърция': { deadline: '2026-07-15', tuition: 0, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Румъния': { deadline: '2026-07-15', tuition: 3000, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'България': { deadline: '2026-07-15', tuition: 600, lang: 'bg', cert: null },
    'Хърватия': { deadline: '2026-07-01', tuition: 3000, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Сърбия': { deadline: '2026-07-01', tuition: 2500, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Унгария': { deadline: '2026-06-30', tuition: 4000, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Словакия': { deadline: '2026-06-30', tuition: 3500, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Словения': { deadline: '2026-06-30', tuition: 3000, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Естония': { deadline: '2026-04-15', tuition: 0, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Латвия': { deadline: '2026-06-01', tuition: 3500, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Литва': { deadline: '2026-06-01', tuition: 3000, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Кипър': { deadline: '2026-06-30', tuition: 3400, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Люксембург': { deadline: '2026-04-30', tuition: 400, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Малта': { deadline: '2026-06-15', tuition: 1200, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Исландия': { deadline: '2026-04-01', tuition: 0, lang: 'en', cert: { type: 'ielts', min: 6.0 } },
    'Албания': { deadline: '2026-07-01', tuition: 2000, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
    'Босна': { deadline: '2026-07-01', tuition: 2000, lang: 'en', cert: { type: 'ielts', min: 5.5 } },
  };

  const fieldPrograms = {
    'IT': { name: 'Computer Science BSc', curriculum: ['Algorithms', 'AI', 'Software Engineering', 'Databases'], careers: ['Software Engineer', 'Data Scientist'] },
    'Инженерство': { name: 'Engineering BSc', curriculum: ['Mathematics', 'Physics', 'Design', 'Materials'], careers: ['Engineer', 'Project Manager'] },
    'Медицина': { name: 'General Medicine', curriculum: ['Anatomy', 'Physiology', 'Pathology', 'Surgery'], careers: ['Doctor', 'Surgeon'] },
    'Бизнес': { name: 'Business Administration BSc', curriculum: ['Management', 'Finance', 'Marketing', 'Strategy'], careers: ['Business Analyst', 'Manager'] },
    'Право': { name: 'Law LLB', curriculum: ['Constitutional Law', 'Civil Law', 'Criminal Law', 'EU Law'], careers: ['Lawyer', 'Legal Advisor'] },
    'Природни науки': { name: 'Natural Sciences BSc', curriculum: ['Physics', 'Chemistry', 'Biology', 'Mathematics'], careers: ['Researcher', 'Lab Scientist'] },
    'Хуманитарни': { name: 'Humanities BA', curriculum: ['Philosophy', 'History', 'Literature', 'Culture Studies'], careers: ['Researcher', 'Writer'] },
    'Архитектура': { name: 'Architecture BSc', curriculum: ['Design Studio', 'Urban Planning', 'Structures'], careers: ['Architect', 'Planner'] },
    'Дизайн': { name: 'Design BSc', curriculum: ['Visual Design', 'UX/UI', 'Typography', 'Branding'], careers: ['Designer', 'Art Director'] },
    'Изкуства': { name: 'Fine Arts BA', curriculum: ['Painting', 'Sculpture', 'Digital Art', 'Art History'], careers: ['Artist', 'Curator'] },
    'Фармация': { name: 'Pharmacy BSc', curriculum: ['Pharmacology', 'Chemistry', 'Toxicology'], careers: ['Pharmacist', 'Researcher'] },
    'Икономика': { name: 'Economics BSc', curriculum: ['Micro', 'Macro', 'Econometrics', 'Finance'], careers: ['Economist', 'Analyst'] },
    'Финанси': { name: 'Finance BSc', curriculum: ['Financial Markets', 'Accounting', 'Risk Management'], careers: ['Financial Analyst', 'Banker'] },
    'Педагогика': { name: 'Education BSc', curriculum: ['Didactics', 'Psychology', 'Curriculum Design'], careers: ['Teacher', 'Educator'] },
  };

  const result = [];
  // Generate for uniIds 88-259 that don't already have manual entries
  const coveredUniIds = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,20,21,22,23,24,25,28,29,30,31,34,35,36,37,38,39,40,41,42,43,44,46,47,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,71,72,73,74,75,76,77,78,79,80,81,82,83,85,86,87]);

  for (let uniId = 71; uniId <= 259; uniId++) {
    if (coveredUniIds.has(uniId)) continue;

    // We don't have access to university data here, so use uniId-based heuristic
    // The actual field will be matched at import time
    const fields = Object.keys(fieldPrograms);
    const field = fields[(uniId * 7) % fields.length]; // deterministic pseudo-random
    const fp = fieldPrograms[field];

    // Country determined by uniId ranges (approximate from the expanded data)
    let country = 'Германия';
    if (uniId >= 88 && uniId <= 95) country = 'Германия';
    else if (uniId >= 96 && uniId <= 110) country = 'Франция';
    else if (uniId >= 111 && uniId <= 120) country = 'Италия';
    else if (uniId >= 121 && uniId <= 132) country = 'Испания';
    else if (uniId >= 133 && uniId <= 140) country = 'Нидерландия';
    else if (uniId >= 141 && uniId <= 148) country = 'Швеция';
    else if (uniId >= 149 && uniId <= 155) country = 'Белгия';
    else if (uniId >= 156 && uniId <= 162) country = 'Швейцария';
    else if (uniId >= 163 && uniId <= 169) country = 'Австрия';
    else if (uniId >= 170 && uniId <= 178) country = 'Полша';
    else if (uniId >= 179 && uniId <= 185) country = 'Чехия';
    else if (uniId >= 186 && uniId <= 190) country = 'Гърция';
    else if (uniId >= 191 && uniId <= 196) country = 'Португалия';
    else if (uniId >= 197 && uniId <= 202) country = 'Унгария';
    else if (uniId >= 203 && uniId <= 208) country = 'Дания';
    else if (uniId >= 209 && uniId <= 214) country = 'Финландия';
    else if (uniId >= 215 && uniId <= 220) country = 'Норвегия';
    else if (uniId >= 221 && uniId <= 225) country = 'Ирландия';
    else if (uniId >= 226 && uniId <= 231) country = 'Румъния';
    else if (uniId >= 232 && uniId <= 235) country = 'Хърватия';
    else if (uniId >= 236 && uniId <= 239) country = 'Словакия';
    else if (uniId >= 240 && uniId <= 242) country = 'Словения';
    else if (uniId >= 243 && uniId <= 245) country = 'Естония';
    else if (uniId >= 246 && uniId <= 248) country = 'Латвия';
    else if (uniId >= 249 && uniId <= 251) country = 'Литва';
    else if (uniId >= 252 && uniId <= 254) country = 'Сърбия';
    else if (uniId >= 255 && uniId <= 256) country = 'Кипър';
    else if (uniId >= 257) country = 'Полша';

    const cd = countryDefaults[country] || countryDefaults['Германия'];

    result.push({
      id: 83 + result.length,
      uniId,
      name: fp.name,
      nameEn: fp.name,
      field,
      level: uniId % 3 === 0 ? 'master' : 'bachelor',
      language: cd.lang,
      duration: field === 'Медицина' ? 12 : uniId % 3 === 0 ? 4 : 6,
      ects: field === 'Медицина' ? 360 : uniId % 3 === 0 ? 120 : 180,
      tuitionPerYear: cd.tuition,
      applicationDeadline: cd.deadline,
      startDate: '2026-09-01',
      requirements: {
        minGPA: 3.0,
        languageCert: cd.cert,
        documents: ['diploma', 'transcript', 'motivation'],
        entranceExam: field === 'Медицина',
      },
      curriculum: fp.curriculum,
      careerOutcomes: fp.careers,
      employability: 75 + (uniId % 20),
    });
  }

  return result;
}

// Utility exports
export const programsByUni = (uniId) => programs.filter(p => p.uniId === uniId);
export const programsByField = (field) => programs.filter(p => p.field === field);
export const allProgramFields = [...new Set(programs.map(p => p.field))].sort();
export const allProgramLanguages = [...new Set(programs.map(p => p.language))].sort();
