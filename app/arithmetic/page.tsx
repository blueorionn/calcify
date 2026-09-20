import type { Metadata } from 'next'
import Header from '@/components/Header'
import ArithmeticCalculator from '@/calc/Arithmetic/Calculator'
import { shareTechMono } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'Arithmetic Calculator | Calcify',
}

export default function Page() {
  return (
    <>
      <Header />
      <main className='bg-muted dark:bg-background h-full w-full pb-12'>
        <section
          className={`${shareTechMono.className} flex h-full w-full items-center justify-center p-4`}
        >
          <ArithmeticCalculator />
        </section>
      </main>
    </>
  )
}
