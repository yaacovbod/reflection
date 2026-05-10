import { GoogleGenAI } from '@google/genai'

const GENDER_LABELS: Record<string, string> = {
  male: 'זכר',
  female: 'נקבה',
}

function buildSystemInstruction(gender: string, grade: string): string {
  return `תפקידך לכתוב פסקת רפלקציה לתעודה בגוף ראשון, בשפה של תלמיד אמיתי בשכבה ${grade}.

כתוב בעברית דבורה, ישירה וטבעית. הרמה הנכונה: כמו שתלמיד ${grade} מדבר בפועל, לא כמו חיבור ספרותי.
מגדר: ${GENDER_LABELS[gender] ?? gender}.

אסור בהחלט: "ניכרה", "השקעתי רבות", "הקפדתי", "סייעתי", "לקראת העתיד", "באופן מלא", "במקביל", "תרמתי משמעותית", "אני מציב לעצמי", "נוכחותי", "הצלחתי להגיע", מילים ספרותיות או ביטויים שמרגישים כתובים על ידי מבוגר.
מותר ומומלץ: "השקעתי", "עבדתי", "הצלחתי", "רציתי", "ניסיתי", "עזרתי לחברים", "הפסקתי לאחר", "אני מתכנן", "אני רוצה להגיע ל".

הנחיות נוספות: שנה את פתיח המשפטים בכל פעם. אל תתחיל תמיד ב"השנה". אין נקודה פסיק ואין מקף ארוך.
אורך: 4 עד 6 שורות. החזר רק את הטקסט הסופי, ללא כותרות.`
}

function buildUserMessage(answers: {
  study: string
  social: string
  conduct: string
  goal: string
}): string {
  return `השקעה לימודית: ${answers.study}
מעורבות חברתית: ${answers.social}
התנהלות ומשמעת: ${answers.conduct}
יעד אופרטיבי: ${answers.goal}`
}

export async function generateReflection(params: {
  gender: string
  grade: string
  answers: { study: string; social: string; conduct: string; goal: string }
}): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_AI_KEY! })

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: {
      temperature: 0.8,
      topP: 0.95,
      systemInstruction: buildSystemInstruction(params.gender, params.grade),
    },
    contents: [{ role: 'user', parts: [{ text: buildUserMessage(params.answers) }] }],
  })

  const text = response.text
  if (!text) throw new Error('Gemini returned empty response')
  return text.trim()
}
