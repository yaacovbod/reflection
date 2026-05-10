import { NextRequest, NextResponse } from 'next/server'
import { generateReflection } from '@/lib/gemini'
import { GRADES } from '@/lib/classes'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { gender, grade, answers } = body

    if (!gender || !['male', 'female'].includes(gender)) {
      return NextResponse.json({ error: 'מגדר לא תקין' }, { status: 400 })
    }
    if (!grade || !(GRADES as readonly string[]).includes(grade)) {
      return NextResponse.json({ error: 'שכבה לא תקינה' }, { status: 400 })
    }
    if (!answers?.study?.trim() || !answers?.social?.trim() || !answers?.conduct?.trim() || !answers?.goal?.trim()) {
      return NextResponse.json({ error: 'יש למלא את כל השאלות' }, { status: 400 })
    }

    const text = await generateReflection({ gender, grade, answers })
    return NextResponse.json({ text })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'שגיאה לא ידועה'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
