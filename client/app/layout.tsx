import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'



export const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', weight: ['400', '500', '600', '700', '800'] })


export const metadata: Metadata = {
  title: 'Manzilini ',
  description: 'Manzilini - Find your dream property with ease.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${manrope.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
