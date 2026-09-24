import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Morrow Studio — ORVIA Web Demonstration',
  description: 'A fictional premium independent hair studio website and booking workspace created by ORVIA Web.',
  robots: { index: false, follow: false }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0}}>{children}</body>
    </html>
  )
}
