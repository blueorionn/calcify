'use client'
import Link from 'next/link'
import { House, Sun, Moon } from 'lucide-react'
import { useThemeProvider } from '@/context/ThemeContext'
import { Button } from '@/components/ui/button'

export default function FloatingNav() {
  const { theme, setTheme } = useThemeProvider()

  return (
    <div className='bg-card/90 border-border fixed top-1/2 left-4 z-40 flex -translate-y-1/2 flex-col gap-1 rounded-xl border p-1.5 shadow-lg backdrop-blur'>
      <Button variant='ghost' size='icon' asChild className='cursor-pointer'>
        <Link href='/' aria-label='Back to home'>
          <House className='size-5' />
        </Link>
      </Button>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className='cursor-pointer'
      >
        {theme === 'dark' ? (
          <Sun className='size-5' />
        ) : (
          <Moon className='size-5' />
        )}
      </Button>
    </div>
  )
}
