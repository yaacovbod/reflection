'use client'

import { useState } from 'react'
import QuestionnaireStep from '@/components/QuestionnaireStep'
import EditStep from '@/components/EditStep'
import SaveStep from '@/components/SaveStep'

type Step = 1 | 2 | 3

interface FormState {
  gender: string
  grade: string
  answers: { study: string; social: string; conduct: string; goal: string }
  aiText: string
}

const STEP_LABELS = ['שאלון', 'עריכה', 'שמירה']

export default function HomePage() {
  const [step, setStep] = useState<Step>(1)
  const [formState, setFormState] = useState<FormState>({
    gender: '',
    grade: '',
    answers: { study: '', social: '', conduct: '', goal: '' },
    aiText: '',
  })
  const [savedText, setSavedText] = useState('')
  const [done, setDone] = useState(false)

  function handleQuestionnaireDone(aiText: string, gender: string, grade: string, answers: { study: string; social: string; conduct: string; goal: string }) {
    setFormState(prev => ({ ...prev, aiText, gender, grade, answers }))
    setStep(2)
  }

  function handleEditConfirm(text: string) {
    setSavedText(text)
    setStep(3)
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">✓</div>
          <h2 className="text-2xl font-extrabold text-accent">הרפלקציה נשמרה בהצלחה!</h2>
          <p className="text-gray-600">המחנך שלך יקבל את הרפלקציה האישית שלך.</p>
          <button
            onClick={() => { setStep(1); setDone(false); setFormState({ gender: '', grade: '', answers: { study: '', social: '', conduct: '', goal: '' }, aiText: '' }); setSavedText('') }}
            className="mt-4 text-sm text-accent underline"
          >
            שלח רפלקציה נוספת
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">רפלקציה אישית לתעודה</h1>
          <p className="text-sm text-gray-500 mt-1">ספר על השנה שלך וה-AI יעצב את הרפלקציה</p>
        </header>

        <div className="flex items-center justify-center gap-0 mb-8">
          {STEP_LABELS.map((label, i) => {
            const num = (i + 1) as Step
            const active = step === num
            const done_ = step > num
            return (
              <div key={num} className="flex items-center">
                <div className={`flex flex-col items-center`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                    ${done_ ? 'bg-accent text-white' : active ? 'bg-accent text-white ring-4 ring-accent-light' : 'bg-gray-200 text-gray-500'}`}>
                    {done_ ? '✓' : num}
                  </div>
                  <span className={`text-xs mt-1 ${active ? 'text-accent font-semibold' : 'text-gray-400'}`}>{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`w-12 h-0.5 mb-4 mx-1 ${step > num ? 'bg-accent' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          {step === 1 && (
            <QuestionnaireStep onDone={handleQuestionnaireDone} />
          )}
          {step === 2 && (
            <EditStep
              initialText={formState.aiText}
              gender={formState.gender}
              grade={formState.grade}
              answers={formState.answers}
              onConfirm={handleEditConfirm}
            />
          )}
          {step === 3 && (
            <SaveStep
              reflection={savedText}
              initialGrade={formState.grade}
              onSuccess={() => setDone(true)}
              onBack={() => setStep(2)}
            />
          )}
        </div>
      </div>
    </main>
  )
}
