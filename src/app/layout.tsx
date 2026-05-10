import type { Metadata } from 'next'
import { Heebo } from 'next/font/google'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'רפלקציה אישית לתעודה | נעימת הלב',
  description: 'כתוב את הרפלקציה האישית שלך לתעודה סוף שנה — בית הספר נעימת הלב',
  openGraph: {
    title: 'רפלקציה אישית לתעודה',
    description: 'בית הספר נעימת הלב — כתוב את הרפלקציה האישית שלך לתעודה סוף שנה',
    siteName: 'נעימת הלב',
    locale: 'he_IL',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-sans bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
