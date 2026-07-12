import type { Metadata } from 'next'
import Header from '@/components/Header'
import ScientificCalculator from '@/calc/Scientific/Calculator'
import { shareTechMono } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'Scientific Calculator | Calcify',
}

export default function Page() {
  return (
    <>
      <Header />
      <main className='bg-muted dark:bg-background h-full w-full pb-12'>
        <section
          className={`${shareTechMono.className} flex h-full w-full items-center justify-center p-4`}
        >
          <ScientificCalculator />
        </section>
      </main>
    </>
  )
}
