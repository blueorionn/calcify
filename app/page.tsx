import Header from '@/components/Header'
import Link from 'next/link'
import {
  ArrowUpRight,
  Calculator,
  CircleDollarSign,
  Sigma,
  Sparkles,
  Tangent,
  Weight,
  type LucideIcon,
} from 'lucide-react'
import { shareTechMono } from '@/lib/fonts'

type Status = 'live' | 'soon'

interface App {
  title: string
  href: string
  description: string
  icon: LucideIcon
  status: Status
}

const APPS: App[] = [
  {
    title: 'Basic',
    href: '/basic',
    icon: Calculator,
    description:
      'Everyday arithmetic with memory keys, backspace and full keyboard support.',
    status: 'live',
  },
  {
    title: 'Scientific',
    href: '/scientific',
    icon: Sigma,
    description:
      'Trig, logs, powers, factorials and constants — in degrees or radians.',
    status: 'live',
  },
  {
    title: 'Graph',
    href: '/graph',
    icon: Tangent,
    description: 'Plot equations and explore how functions behave.',
    status: 'soon',
  },
  {
    title: 'BMI',
    href: '/bmi',
    icon: Weight,
    description: 'Body mass index with a healthy-range scale for your build.',
    status: 'live',
  },
  {
    title: 'Currency',
    href: '/currency',
    icon: CircleDollarSign,
    description: 'Convert between world currencies with live exchange rates.',
    status: 'live',
  },
]

function StatusBadge({ status }: { status: Status }) {
  if (status === 'live') {
    return (
      <span className='inline-flex w-max items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
        <span className='size-1.5 rounded-full bg-current' />
        Live
      </span>
    )
  }
  return (
    <span className='inline-flex w-max items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400'>
      <span className='size-1.5 rounded-full bg-current' />
      Coming soon
    </span>
  )
}

function AppCard({ title, href, description, icon: Icon, status }: App) {
  return (
    <Link
      href={href}
      className='bg-card text-foreground border-border group flex cursor-pointer flex-col gap-3 rounded border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-sky-200 hover:shadow-md dark:hover:bg-sky-900'
    >
      <div className='flex items-start justify-between'>
        <div className='flex size-11 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400'>
          <Icon className='size-6' />
        </div>
        <ArrowUpRight className='text-muted-foreground size-5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100' />
      </div>
      <div className='flex flex-1 flex-col gap-2'>
        <h2 className='font-mono text-sm font-semibold tracking-widest uppercase'>
          {title}
        </h2>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          {description}
        </p>
      </div>
      <StatusBadge status={status} />
    </Link>
  )
}

export default function Home() {
  return (
    <>
      <Header />
      <main className='bg-muted dark:bg-background h-full w-full pb-12'>
        <section className='mx-auto w-full max-w-5xl px-4 pt-16 pb-8 text-center md:pt-24'>
          <h1 className={`${shareTechMono.className} text-4xl md:text-5xl`}>
            Every calculator you need
          </h1>
          <p className='text-muted-foreground mx-auto mt-4 max-w-xl text-base md:text-lg'>
            A growing suite of fast, clean tools that run entirely in your
            browser — no sign-up, no clutter, just answers.
          </p>
        </section>
        <section
          aria-label='Calculators'
          className='xs:grid-cols-2 mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 lg:grid-cols-3'
        >
          {APPS.map((app) => (
            <AppCard key={app.title} {...app} />
          ))}
          <div className='border-border text-muted-foreground flex flex-col gap-3 rounded border border-dashed p-6'>
            <div className='flex size-11 items-center justify-center rounded-lg border border-dashed'>
              <Sparkles className='size-6' />
            </div>
            <div className='flex flex-1 flex-col gap-2'>
              <h2 className='font-mono text-sm font-semibold tracking-widest uppercase'>
                More on the way
              </h2>
              <p className='text-sm leading-relaxed'>
                New calculators are added regularly — suggest one on GitHub.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
