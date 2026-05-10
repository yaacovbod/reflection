'use client'

import { useState } from 'react'
import Spinner from './Spinner'
import { GRADES, Grade, CLASS_NUMBERS, ClassNumber, buildClassName } from '@/lib/classes'

interface Props {
  reflection: string
  initialGrade: string
  onSuccess: () => void
}

export default function SaveStep({ reflection, initialGrade, onSuccess }: Props) {
  const validInitial = (GRADES as readonly string[]).includes(initialGrade) ? (initialGrade as Grade) : GRADES[0]
  const [name, setName] = useState('')
  const [grade, setGrade] = useState<Grade>(validInitial)
  const [classNum, setClassNum] = useState<ClassNumber>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('יש להזין שם מלא'); return }

    const className = buildClassName(grade, classNum)
    setLoading(true)
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className, name: name.trim(), reflection }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'שגיאה בשמירה'); return }
      onSuccess()
    } catch {
      setError('שגיאת רשת. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="bg-accent-light rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap border border-cyan-200">
        {reflection}
      </div>

      <div>
        <label className="text-sm font-bold block mb-1.5">שם מלא</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="שם פרטי ושם משפחה"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px] text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-bold block mb-1.5">שכבה</label>
          <select
            value={grade}
            onChange={e => setGrade(e.target.value as Grade)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
          >
            {GRADES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold block mb-1.5">מספר כיתה</label>
          <select
            value={classNum}
            onChange={e => setClassNum(Number(e.target.value) as ClassNumber)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
          >
            {CLASS_NUMBERS.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        הרפלקציה תישמר לכיתה <strong>{grade}{classNum}</strong>
      </p>

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-2"><Spinner /></div>
      ) : (
        <button
          type="submit"
          className="w-full bg-accent text-white font-bold rounded-xl py-3 min-h-[44px] hover:bg-cyan-700 transition-colors"
        >
          שמור ושדר למחנך
        </button>
      )}
    </form>
  )
}
