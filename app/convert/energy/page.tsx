import type { Metadata } from 'next'
import FloatingNav from '@/components/FloatingNav'
import EnergyConversion from '@/calc/conversion/energy/EnergyConversion'
import { shareTechMono } from '@/lib/fonts'

export const metadata: Metadata = {
  title: 'Energy Conversion | Calcify',
}

export default function Page() {
  return (
    <>
      <FloatingNav name='Energy Conversion' />
      <main className='bg-muted dark:bg-background h-full w-full pb-12'>
        <section
          className={`${shareTechMono.className} flex h-full w-full flex-col items-center justify-center p-4`}
        >
          <EnergyConversion />
        </section>
      </main>
    </>
  )
}
