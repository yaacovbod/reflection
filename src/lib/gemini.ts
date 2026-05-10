import { GoogleGenAI } from '@google/genai'

const GENDER_LABELS: Record<string, string> = {
  male: 'זכר',
  female: 'נקבה',
}

function buildSystemInstruction(gender: string, grade: string): string {
  return `אתה מומחה לכתיבה פדגוגית יצירתית. תפקידך להפוך תשובות גולמיות של תלמיד לפסקת רפלקציה אישית בגוף ראשון עבור התעודה.
הנחיית גיוון ומקוריות: אל תהיה תבניתי. שנה את מבנה המשפטים והפתיחים בכל פעם (אל תתחיל תמיד ב'השנה' או 'במהלך'). השתמש באוצר מילים עשיר ומגוון.
דגשי ניסוח: כתיבה בגוף ראשון לפי המגדר (${GENDER_LABELS[gender] ?? gender}), התאמת רמת השפה לגיל (שכבה ${grade}), וטון 'תכלס' ענייני (התמקד בהישגים ויעדים, לא במילים מופשטות).
חוקי פיסוק: אל תשתמש בנקודה פסיק ובמקפים ארוכים. השתמש רק בנקודות ופסיקים רגילים.
אורך: 4 עד 6 שורות. החזר רק את הטקסט הסופי.`
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
