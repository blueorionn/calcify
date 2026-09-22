import { SerwistProvider } from '@serwist/turbopack/react'
import type { Metadata, Viewport } from 'next'
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

const APP_NAME = 'Calcify'
const TITLE = 'Calcify - Simple Calculator'
const DESCRIPTION =
  'A growing suite of fast, clean calculators — basic, scientific, graph, BMI and currency — running right in your browser.'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: TITLE,
    statusBarStyle: 'default',
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#040406' },
  ],
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
          <SerwistProvider
            swUrl='/serwist/sw.js'
            disable={process.env.NODE_ENV === 'development'}
          >
            {children}
          </SerwistProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
