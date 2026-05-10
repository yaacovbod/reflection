import { NextRequest, NextResponse } from 'next/server'
import { appendReflection } from '@/lib/sheets'
import { ALL_CLASSES } from '@/lib/classes'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { className, name, reflection } = body

    if (!className || !ALL_CLASSES.includes(className)) {
      return NextResponse.json({ error: 'כיתה לא תקינה' }, { status: 400 })
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: 'יש להזין שם מלא' }, { status: 400 })
    }
    if (!reflection?.trim()) {
      return NextResponse.json({ error: 'הרפלקציה ריקה' }, { status: 400 })
    }

    await appendReflection({ className, name: name.trim(), reflection: reflection.trim() })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'שגיאה לא ידועה'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
