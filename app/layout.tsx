import type { Metadata } from 'next'
import PwaRegister from '@/components/PwaRegister'
import { ThemeProvider } from '@/context/ThemeContext'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const TITLE = 'Calcify - Simple Calculator'
const DESCRIPTION =
  'A fast, clean, and responsive calculator for everyday arithmetic calculations.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  manifest: '/manifest.json',
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
  other: {
    'theme-color': '#0a0a0a',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='flex min-h-full flex-col'>
        <ThemeProvider>
          {children}
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}
