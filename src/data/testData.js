// RIASEC (Holland Code) Test Questions
export const questions = [
  { q: "Обичам да работя с ръце – сглобявам, поправям, строя.", dim: "R", e: "🔧" },
  { q: "Интересувам се как работят нещата – обичам да изследвам и анализирам.", dim: "I", e: "🔬" },
  { q: "Обичам да рисувам, пиша или създавам нещо красиво.", dim: "A", e: "🎨" },
  { q: "Обичам да помагам на хора – изслушвам, съветвам, уча.", dim: "S", e: "🤝" },
  { q: "Обичам да организирам, ръководя и убеждавам.", dim: "E", e: "📢" },
  { q: "Обичам да работя с данни, числа и подреждане.", dim: "C", e: "📋" },
  { q: "Предпочитам практически задачи пред теория.", dim: "R", e: "🛠️" },
  { q: "Обичам да правя експерименти и да откривам ново.", dim: "I", e: "🧪" },
  { q: "Музиката, изкуството или дизайна са ми страст.", dim: "A", e: "🎭" },
  { q: "Работя добре в екип и обичам да общувам.", dim: "S", e: "💬" },
  { q: "Виждам се като лидер – обичам да поемам инициатива.", dim: "E", e: "🚀" },
  { q: "Обичам систематична работа – графици, правила, ред.", dim: "C", e: "📊" },
  { q: "Обичам да работя на открито или с техника.", dim: "R", e: "⛰️" },
  { q: "Обичам да решавам сложни проблеми и пъзели.", dim: "I", e: "🧩" },
  { q: "Обичам да изразявам себе си по креативен начин.", dim: "A", e: "✨" },
  { q: "Доброволчеството и социалната работа ми носят радост.", dim: "S", e: "❤️" },
  { q: "Обичам състезания, дебати и предизвикателства.", dim: "E", e: "🏆" },
  { q: "Обичам прецизност – детайлите са важни за мен.", dim: "C", e: "🎯" },
];

export const RIASEC_MAP = {
  R: { name: "Реалистичен", fields: ["Инженерство", "Архитектура", "Електроника"], desc: "Практичен, обичаш работа с ръце и техника.", color: "#2563EB" },
  I: { name: "Изследователски", fields: ["Природни науки", "Медицина", "Фармация", "IT"], desc: "Аналитичен, обичаш науката и откритията.", color: "#7C3AED" },
  A: { name: "Артистичен", fields: ["Изкуства", "Дизайн", "Хуманитарни"], desc: "Креативен, изразяваш се чрез изкуство.", color: "#059669" },
  S: { name: "Социален", fields: ["Педагогика", "Медицина", "Хуманитарни"], desc: "Емпатичен, обичаш да помагаш на хора.", color: "#EA580C" },
  E: { name: "Предприемачески", fields: ["Бизнес", "Маркетинг", "Право", "Финанси", "Икономика"], desc: "Лидер, обичаш да убеждаваш и организираш.", color: "#E11D48" },
  C: { name: "Конвенционален", fields: ["Финанси", "Икономика", "Право", "IT"], desc: "Прецизен, обичаш ред, данни и системи.", color: "#0891B2" },
};

export const dimEmoji = { R: "🔧", I: "🔬", A: "🎨", S: "🤝", E: "📢", C: "📋" };

// ─── PERSONALITY ARCHETYPES (based on top-2 Holland Code) ─────────
export const archetypes = {
  RI: { name: "Иноватор", emoji: "🔬", desc: "Съчетаваш практичност с аналитичен ум. Обичаш да строиш неща базирани на наука.", famous: "Илон Мъск, Никола Тесла", careers: "Инженер-изследовател, Biotech, Robotics" },
  RA: { name: "Майстор", emoji: "🛠️", desc: "Творец с умели ръце. Превръщаш идеи в реални обекти.", famous: "Стив Джобс, Джеймс Дайсън", careers: "Индустриален дизайн, Архитект, Luthier" },
  RS: { name: "Наставник", emoji: "🏗️", desc: "Практичен и грижовен. Помагаш на другите с реални решения.", famous: "Джими Картър", careers: "Физиотерапевт, Трудотерапевт, Треньор" },
  RE: { name: "Капитан", emoji: "⚓", desc: "Лидер с практична хватка. Водиш екипи към конкретни резултати.", famous: "Хенри Форд", careers: "Строителен мениджър, Операционен директор" },
  RC: { name: "Техник", emoji: "⚙️", desc: "Прецизен и практичен. Перфекционист в техническите детайли.", famous: "Леонардо да Винчи", careers: "DevOps, QA Engineer, Пилот" },
  IR: { name: "Иноватор", emoji: "🔬", desc: "Научен ум с практически наклонности.", famous: "Илон Мъск, Никола Тесла", careers: "Инженер-изследовател, R&D" },
  IA: { name: "Визионер", emoji: "🔭", desc: "Мислител с креативно въображение. Виждаш света различно.", famous: "Алберт Айнщайн, Мари Кюри", careers: "Учен, Теоретичен физик, UX Research" },
  IS: { name: "Целител", emoji: "💊", desc: "Научен подход към помагането. Лекуваш с познание.", famous: "Джонас Солк, Флорънс Найтингейл", careers: "Лекар, Психолог, Биомедицина" },
  IE: { name: "Стратег", emoji: "🧠", desc: "Аналитичен лидер. Решаваш сложни проблеми стратегически.", famous: "Бил Гейтс, Шерил Сандбърг", careers: "Data Scientist, Консултант, CTO" },
  IC: { name: "Аналитик", emoji: "📐", desc: "Перфектната комбинация от любопитство и систематичност.", famous: "Алан Тюринг", careers: "Математик, Статистик, ML Engineer" },
  AR: { name: "Майстор", emoji: "🛠️", desc: "Творец с практически умения.", famous: "Стив Джобс", careers: "Product Designer, Архитект" },
  AI: { name: "Визионер", emoji: "🔭", desc: "Креативен с дълбоко мислене.", famous: "Леонардо да Винчи", careers: "Creative Technologist, Писател" },
  AS: { name: "Вдъхновител", emoji: "✨", desc: "Творец, който вдъхновява и помага. Изкуството ти е мост към хората.", famous: "Фрида Кало, Боб Рос", careers: "Арт терапевт, Учител по изкуства, Режисьор" },
  AE: { name: "Шоумен", emoji: "🎬", desc: "Харизматичен творец. Обичаш и да създаваш, и да презентираш.", famous: "Уолт Дисни, Опра Уинфри", careers: "Продуцент, Creative Director, Influencer" },
  AC: { name: "Перфекционист", emoji: "🎨", desc: "Творец с око за детайла. Всяко произведение е прецизно.", famous: "Вес Андерсън, Диетер Рамс", careers: "Графичен дизайнер, Типограф, UI Designer" },
  SR: { name: "Наставник", emoji: "🏗️", desc: "Помагаш практично.", famous: "Джими Картър", careers: "Физиотерапевт, Социален работник" },
  SI: { name: "Целител", emoji: "💊", desc: "Научен подход към грижата.", famous: "Карл Роджърс", careers: "Психолог, Лекар, Генетичен консултант" },
  SA: { name: "Вдъхновител", emoji: "✨", desc: "Помагаш чрез творчество.", famous: "Мария Монтесори", careers: "Учител, Музикален терапевт" },
  SE: { name: "Дипломат", emoji: "🤝", desc: "Социален лидер. Обединяваш хора около обща кауза.", famous: "Нелсън Мандела, Малала", careers: "HR Director, Политик, NGO мениджър" },
  SC: { name: "Координатор", emoji: "📊", desc: "Организиран помагач. Създаваш системи за подкрепа.", famous: "Флорънс Найтингейл", careers: "Мед. администратор, Социален координатор" },
  ER: { name: "Капитан", emoji: "⚓", desc: "Лидер с практическа хватка.", famous: "Хенри Форд", careers: "COO, Строителен предприемач" },
  EI: { name: "Стратег", emoji: "🧠", desc: "Визионерски лидер.", famous: "Бил Гейтс", careers: "CEO, Стратегически консултант" },
  EA: { name: "Шоумен", emoji: "🎬", desc: "Харизматичен и креативен.", famous: "Уолт Дисни", careers: "Creative Director, Предприемач" },
  ES: { name: "Дипломат", emoji: "🤝", desc: "Лидер който обединява.", famous: "Барак Обама", careers: "Политик, HR Director, Coach" },
  EC: { name: "Директор", emoji: "👔", desc: "Амбициозен и организиран. Водиш с план и дисциплина.", famous: "Тим Кук, Маргарет Тачър", careers: "CFO, Мениджър, Консултант" },
  CR: { name: "Техник", emoji: "⚙️", desc: "Прецизен и практичен.", famous: "Линус Торвалдс", careers: "System Admin, QA" },
  CI: { name: "Аналитик", emoji: "📐", desc: "Систематичен изследовател.", famous: "Алан Тюринг", careers: "Data Analyst, Актюер" },
  CA: { name: "Перфекционист", emoji: "🎨", desc: "Прецизен творец.", famous: "Диетер Рамс", careers: "UI/UX, Графичен дизайн" },
  CS: { name: "Координатор", emoji: "📊", desc: "Организиран и грижовен.", famous: "Мери Бара", careers: "Администратор, Логистик" },
  CE: { name: "Директор", emoji: "👔", desc: "Организиран лидер.", famous: "Тим Кук", careers: "Финансов мениджър, Операции" },
};

export function getArchetype(top2) {
  const key = top2[0] + top2[1];
  return archetypes[key] || { name: "Изследовател", emoji: "🌟", desc: "Уникална комбинация от качества!", famous: "Ти!", careers: "Мултидисциплинарни роли" };
}

// ─── CAREER OUTCOMES DATA ─────────────────────
// salary_1y: average salary 1 year after graduation (EUR/year), by country
export const careerOutcomes = {
  "България":    { salary1y: 12000, salary3y: 18000, salary5y: 24000, topIndustries: ["IT","Финанси","Услуги"], unemployment: 4.2 },
  "Германия":    { salary1y: 38000, salary3y: 48000, salary5y: 58000, topIndustries: ["Инженерство","IT","Automotive"], unemployment: 3.1 },
  "UK":          { salary1y: 32000, salary3y: 42000, salary5y: 55000, topIndustries: ["Финанси","Tech","Consulting"], unemployment: 4.0 },
  "Нидерландия": { salary1y: 36000, salary3y: 46000, salary5y: 56000, topIndustries: ["Tech","Логистика","Финанси"], unemployment: 3.5 },
  "Франция":     { salary1y: 30000, salary3y: 40000, salary5y: 50000, topIndustries: ["Luxury","Tech","Инженерство"], unemployment: 7.1 },
  "Италия":      { salary1y: 24000, salary3y: 32000, salary5y: 40000, topIndustries: ["Мода","Инженерство","Туризъм"], unemployment: 7.8 },
  "Испания":     { salary1y: 22000, salary3y: 30000, salary5y: 38000, topIndustries: ["Туризъм","Tech","Банки"], unemployment: 11.5 },
  "Швейцария":   { salary1y: 65000, salary3y: 80000, salary5y: 95000, topIndustries: ["Pharma","Финанси","Tech"], unemployment: 2.1 },
  "Швеция":      { salary1y: 34000, salary3y: 42000, salary5y: 52000, topIndustries: ["Tech","Gaming","GreenTech"], unemployment: 6.8 },
  "Дания":       { salary1y: 38000, salary3y: 48000, salary5y: 58000, topIndustries: ["Pharma","Wind Energy","IT"], unemployment: 4.8 },
  "Норвегия":    { salary1y: 42000, salary3y: 52000, salary5y: 62000, topIndustries: ["Нефт/Газ","Tech","Maritime"], unemployment: 3.3 },
  "Австрия":     { salary1y: 34000, salary3y: 44000, salary5y: 52000, topIndustries: ["Туризъм","Инженерство","IT"], unemployment: 4.9 },
  "Полша":       { salary1y: 16000, salary3y: 22000, salary5y: 30000, topIndustries: ["IT","BPO","Automotive"], unemployment: 2.8 },
  "Чехия":       { salary1y: 18000, salary3y: 24000, salary5y: 32000, topIndustries: ["IT","Automotive","Pharma"], unemployment: 2.5 },
  "Ирландия":    { salary1y: 36000, salary3y: 48000, salary5y: 60000, topIndustries: ["Tech","Pharma","Финанси"], unemployment: 4.2 },
  "Румъния":     { salary1y: 14000, salary3y: 20000, salary5y: 26000, topIndustries: ["IT","Automotive","BPO"], unemployment: 5.5 },
  "Гърция":      { salary1y: 16000, salary3y: 22000, salary5y: 28000, topIndustries: ["Туризъм","Shipping","IT"], unemployment: 10.8 },
  "Белгия":      { salary1y: 34000, salary3y: 44000, salary5y: 54000, topIndustries: ["EU институции","Pharma","Логистика"], unemployment: 5.5 },
  "Финландия":   { salary1y: 32000, salary3y: 42000, salary5y: 52000, topIndustries: ["Tech","Gaming","Forestry"], unemployment: 6.8 },
  "Португалия":  { salary1y: 18000, salary3y: 24000, salary5y: 32000, topIndustries: ["Tech","Туризъм","Textile"], unemployment: 6.1 },
  "Унгария":     { salary1y: 14000, salary3y: 20000, salary5y: 26000, topIndustries: ["Automotive","IT","Pharma"], unemployment: 3.8 },
  "Хърватия":    { salary1y: 14000, salary3y: 18000, salary5y: 24000, topIndustries: ["Туризъм","IT","Индустрия"], unemployment: 6.2 },
  "Сърбия":      { salary1y: 12000, salary3y: 16000, salary5y: 22000, topIndustries: ["IT","Automotive","Земеделие"], unemployment: 9.0 },
};

// Scholarships database
export const scholarships = [
  { id: 1, name: "Erasmus+", country: "EU", amount: "€800–1200/мес", fields: ["Всички"], level: ["Бакалавър", "Магистър"], deadline: "Февруари", url: "erasmusplus.bg", desc: "Програма на ЕС за мобилност. Покрива пътуване + месечна стипендия.", flag: "🇪🇺" },
  { id: 2, name: "DAAD Стипендия", country: "Германия", amount: "€934/мес", fields: ["Всички"], level: ["Магистър", "Докторат"], deadline: "Октомври", url: "daad.de", desc: "Германска академична служба – пълна стипендия за Германия.", flag: "🇩🇪" },
  { id: 3, name: "Chevening", country: "UK", amount: "Пълна", fields: ["Всички"], level: ["Магистър"], deadline: "Ноември", url: "chevening.org", desc: "Престижна британска правителствена стипендия. Покрива всичко.", flag: "🇬🇧" },
  { id: 4, name: "Holland Scholarship", country: "Нидерландия", amount: "€5000", fields: ["Всички"], level: ["Бакалавър", "Магистър"], deadline: "Февруари", url: "studyinholland.nl", desc: "За не-EU студенти в нидерландски университети.", flag: "🇳🇱" },
  { id: 5, name: "Swiss Excellence", country: "Швейцария", amount: "CHF 1920/мес", fields: ["Всички"], level: ["Докторат", "Пост-док"], deadline: "Август", url: "sbfi.admin.ch", desc: "Швейцарска правителствена стипендия за изследователи.", flag: "🇨🇭" },
  { id: 6, name: "SI Scholarship", country: "Швеция", amount: "SEK 10000/мес", fields: ["Всички"], level: ["Магистър"], deadline: "Февруари", url: "si.se", desc: "Swedish Institute стипендия – покрива такси + издръжка.", flag: "🇸🇪" },
  { id: 7, name: "Eiffel Excellence", country: "Франция", amount: "€1181/мес", fields: ["Инженерство", "IT", "Право", "Икономика"], level: ["Магистър", "Докторат"], deadline: "Януари", url: "campusfrance.org", desc: "Френска правителствена стипендия за топ студенти.", flag: "🇫🇷" },
  { id: 8, name: "Italian Gov. Scholarship", country: "Италия", amount: "€900/мес", fields: ["Всички"], level: ["Магистър", "Докторат"], deadline: "Юни", url: "esteri.it", desc: "Италианска правителствена стипендия за чужденци.", flag: "🇮🇹" },
  { id: 9, name: "Visegrad Fund", country: "ЦЕ", amount: "€2300/семестър", fields: ["Всички"], level: ["Магистър"], deadline: "Март", url: "visegradfund.org", desc: "За студенти от/към Вишеградските държави (PL, CZ, SK, HU).", flag: "🏛️" },
  { id: 10, name: "Fulbright Bulgaria", country: "САЩ/БГ", amount: "Пълна", fields: ["Всички"], level: ["Магистър", "Докторат"], deadline: "Октомври", url: "fulbright.bg", desc: "Престижна американска стипендия за български студенти.", flag: "🇺🇸" },
  { id: 11, name: "Gates Cambridge", country: "UK", amount: "Пълна", fields: ["Всички"], level: ["Магистър", "Докторат"], deadline: "Декември", url: "gatescambridge.org", desc: "Една от най-престижните в света – за Cambridge.", flag: "🎓" },
  { id: 12, name: "Stipendium Hungaricum", country: "Унгария", amount: "€130-390/мес", fields: ["Всички"], level: ["Бакалавър", "Магистър", "Докторат"], deadline: "Януари", url: "stipendiumhungaricum.hu", desc: "Унгарска правителствена стипендия – без такси.", flag: "🇭🇺" },
  { id: 13, name: "CEEPUS", country: "ЦЕ", amount: "€300-500/мес", fields: ["Всички"], level: ["Бакалавър", "Магистър"], deadline: "Юни/Ноември", url: "ceepus.info", desc: "Мобилност между ЦЕ университети.", flag: "🏛️" },
  { id: 14, name: "GKS Scholarship", country: "Южна Корея", amount: "Пълна", fields: ["Всички"], level: ["Бакалавър", "Магистър"], deadline: "Март", url: "studyinkorea.go.kr", desc: "Корейска правителствена стипендия – пълно покритие.", flag: "🇰🇷" },
  { id: 15, name: "МОН Стипендия", country: "България", amount: "250-600 лв/мес", fields: ["Всички"], level: ["Бакалавър", "Магистър"], deadline: "Целогодишно", url: "mon.bg", desc: "Стипендии от МОН за отлични резултати.", flag: "🇧🇬" },
];
