# רפלקציה אישית — מערכת AI לתעודות סוף שנה

## מטרת הפרויקט
מערכת לעזור ל-650 תלמידים (כיתות ז-יב) לכתוב פסקת רפלקציה אישית לתעודה סוף שנה. התלמיד ממלא שאלון קצר, Gemini AI מייצר פסקה בגוף ראשון, התלמיד עורך ומאשר, המחנך מקבל את הרפלקציה שמורה ב-Google Sheets.

## טכנולוגיות
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS (RTL, Heebo, פלטת Clarity)
- @google/genai (Gemini AI)
- google-auth-library (JWT Service Account)
- Google Sheets API v4 (fetch ישיר, לא googleapis)
- Vercel (פריסה)

## מבנה קבצים מרכזי
src/app/layout.tsx, page.tsx, globals.css
src/app/api/reflect/route.ts, src/app/api/save/route.ts
src/lib/classes.ts, gemini.ts, sheets.ts
src/components/Spinner.tsx, QuestionnaireStep.tsx, EditStep.tsx, SaveStep.tsx

## קהל יעד
תלמידים בכיתות ז-יב, בית ספר נעימת הלב, חריש.

## משתני סביבה
GOOGLE_GEN_AI_KEY, GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY
