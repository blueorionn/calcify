'use client'
import Link from 'next/link'
import { House, Sun, Moon } from 'lucide-react'
import { useThemeProvider } from '@/context/ThemeContext'
import { Button } from '@/components/ui/button'

export default function FloatingNav({ name }: { name: string }) {
  const { theme, setTheme } = useThemeProvider()

  return (
    <div className='bg-card/90 border-border fixed top-4 left-4 z-40 flex items-center gap-1 rounded-lg border p-1.5 shadow-lg backdrop-blur'>
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

      <span className='bg-border mx-1 h-5 w-px' aria-hidden='true' />
      <span className='text-foreground pr-2.5 pl-0.5 font-mono text-xs font-medium uppercase select-none'>
        {name}
      </span>
    </div>
  )
}
