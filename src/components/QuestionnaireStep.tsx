'use client'

import { useState } from 'react'
import Spinner from './Spinner'
import { GRADES, Grade } from '@/lib/classes'

interface Answers {
  study: string
  social: string
  conduct: string
  goal: string
}

interface Props {
  onDone: (aiText: string, gender: string, grade: string, answers: Answers) => void
}

const QUESTIONS: { key: keyof Answers; label: string; hint: string }[] = [
  {
    key: 'study',
    label: 'השקעה לימודית',
    hint: 'באיזה מקצוע או פרויקט השקעת הכי הרבה מאמץ השנה, ומהו ההישג שאתה גאה בו?',
  },
  {
    key: 'social',
    label: 'מעורבות חברתית',
    hint: 'איך תתאר את התרומה שלך לאווירה בכיתה ואת היחסים שלך עם החברים והמורים?',
  },
  {
    key: 'conduct',
    label: 'התנהלות ומשמעת',
    hint: 'איזה הרגל אישי (עמידה בזמנים, סדר, כללי בית ספר) שיפרת השנה וכיצד זה עזר לך?',
  },
  {
    key: 'goal',
    label: 'יעד להמשך',
    hint: 'מהו היעד המעשי המרכזי שאתה מציב לעצמך לשנה הבאה כדי להתקדם?',
  },
]

export default function QuestionnaireStep({ onDone }: Props) {
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [grade, setGrade] = useState<Grade | ''>('')
  const [answers, setAnswers] = useState<Answers>({ study: '', social: '', conduct: '', goal: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!gender) { setError('יש לבחור מגדר'); return }
    if (!grade) { setError('יש לבחור שכבה'); return }
    for (const q of QUESTIONS) {
      if (!answers[q.key].trim() || answers[q.key].trim().length < 10) {
        setError(`יש למלא את שדה "${q.label}" (לפחות 10 תווים)`)
        return
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gender, grade, answers }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'שגיאה ביצירת הרפלקציה'); return }
      onDone(data.text, gender, grade, answers)
    } catch {
      setError('שגיאת רשת. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-bold mb-2">מגדר</p>
          <div className="flex gap-3">
            {[{ v: 'male', l: 'זכר' }, { v: 'female', l: 'נקבה' }].map(({ v, l }) => (
              <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={v}
                  checked={gender === v}
                  onChange={() => setGender(v as 'male' | 'female')}
                  className="accent-accent"
                />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-bold block mb-2">שכבה</label>
          <select
            value={grade}
            onChange={e => setGrade(e.target.value as Grade)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
          >
            <option value="">בחר שכבה</option>
            {GRADES.map(g => (
              <option key={g} value={g}>כיתה {g}</option>
            ))}
          </select>
        </div>
      </div>

      {QUESTIONS.map(q => (
        <div key={q.key}>
          <label className="text-sm font-bold block mb-1">{q.label}</label>
          <p className="text-xs text-gray-500 mb-1.5">{q.hint}</p>
          <textarea
            value={answers[q.key]}
            onChange={e => setAnswers(prev => ({ ...prev, [q.key]: e.target.value }))}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            placeholder="כתבו כאן..."
          />
        </div>
      ))}

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-2"><Spinner /></div>
      ) : (
        <button
          type="submit"
          className="w-full bg-accent text-white font-bold rounded-xl py-3 min-h-[44px] hover:bg-cyan-700 transition-colors"
        >
          הפק טיוטת רפלקציה
        </button>
      )}
    </form>
  )
}
