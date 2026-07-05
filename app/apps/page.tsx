import Header from '@/components/Header'
import Link from 'next/link'
import {
  Weight,
  CircleDollarSign,
  Calculator,
  Tangent,
  Sigma,
  type LucideIcon,
} from 'lucide-react'

function Card({
  title,
  href,
  icon: Icon,
}: {
  title: string
  href: string
  icon: LucideIcon
}) {
  return (
    <Link
      href={href}
      className='bg-card text-foreground border-border flex cursor-pointer flex-col items-center gap-3 rounded border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-sky-200 hover:shadow-md dark:hover:bg-sky-900'
    >
      <Icon className='size-8 text-slate-600 transition-colors duration-200 dark:text-slate-400' />
      <h2 className='font-mono text-sm font-semibold tracking-widest uppercase'>
        {title}
      </h2>
    </Link>
  )
}

export default function Page() {
  return (
    <>
      <Header />
      <main className='bg-muted dark:bg-background h-full w-full pb-12'>
        <section className='mx-auto mt-24 grid w-full max-w-5xl grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-5'>
          <Card title='Arithmetic' icon={Calculator} href='/' />
          <Card title='Scientific' icon={Sigma} href='/scientific' />
          <Card title='Graph' icon={Tangent} href='/graph' />
          <Card title='BMI' icon={Weight} href='/bmi' />
          <Card title='Currency' icon={CircleDollarSign} href='/currency' />
        </section>
      </main>
    </>
  )
}
