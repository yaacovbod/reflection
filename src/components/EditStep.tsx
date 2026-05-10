'use client'

import { useState } from 'react'
import Spinner from './Spinner'

interface Props {
  initialText: string
  gender: string
  grade: string
  answers: { study: string; social: string; conduct: string; goal: string }
  onConfirm: (text: string) => void
}

export default function EditStep({ initialText, gender, grade, answers, onConfirm }: Props) {
  const [text, setText] = useState(initialText)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState('')

  async function handleRegenerate() {
    setError('')
    setRegenerating(true)
    try {
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gender, grade, answers }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'שגיאה'); return }
      setText(data.text)
    } catch {
      setError('שגיאת רשת. נסה שוב.')
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        זו הטיוטה שנוצרה. ערוך אם תרצה, ואז לחץ "אישור והמשך".
      </p>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={7}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent text-sm leading-relaxed"
      />

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <button
        onClick={() => onConfirm(text)}
        disabled={!text.trim()}
        className="w-full bg-accent text-white font-bold rounded-xl py-3 min-h-[44px] hover:bg-cyan-700 transition-colors disabled:opacity-50"
      >
        אישור והמשך
      </button>
    </div>
  )
}
