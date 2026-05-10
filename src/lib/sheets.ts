import { JWT } from 'google-auth-library'

async function getAccessToken(): Promise<string> {
  const client = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n').replace(/^["']|["']$/g, ''),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const { token } = await client.getAccessToken()
  if (!token) throw new Error('Failed to get access token')
  return token
}

async function sheetExists(token: string, spreadsheetId: string, title: string): Promise<boolean> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Sheets metadata error: ${res.status} ${body}`)
  }
  const data = await res.json()
  const titles: string[] = (data.sheets ?? []).map((s: { properties: { title: string } }) => s.properties.title)
  return titles.includes(title)
}

async function createSheet(token: string, spreadsheetId: string, title: string): Promise<void> {
  const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`
  const batchRes = await fetch(batchUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title } } }] }),
  })
  if (!batchRes.ok) {
    const body = await batchRes.text()
    throw new Error(`Create sheet error: ${batchRes.status} ${body}`)
  }

  const headersUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(title)}!A1:C1?valueInputOption=USER_ENTERED`
  const headersRes = await fetch(headersUrl, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [['חותמת זמן', 'שם', 'רפלקציה']] }),
  })
  if (!headersRes.ok) {
    const body = await headersRes.text()
    throw new Error(`Headers write error: ${headersRes.status} ${body}`)
  }
}

export async function appendReflection(params: {
  className: string
  name: string
  reflection: string
}): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID!
  const token = await getAccessToken()

  const exists = await sheetExists(token, spreadsheetId, params.className)
  if (!exists) {
    await createSheet(token, spreadsheetId, params.className)
  }

  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(params.className)}!A:C:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`
  const timestamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })

  const appendRes = await fetch(appendUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [[timestamp, params.name, params.reflection]] }),
  })
  if (!appendRes.ok) {
    const body = await appendRes.text()
    throw new Error(`Append error: ${appendRes.status} ${body}`)
  }
}
