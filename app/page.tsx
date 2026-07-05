import Header from '@/components/Header'
import ArithmeticCalculator from '@/calc/ArithmeticCalculator'
import { Share_Tech_Mono } from 'next/font/google'

const shareTechMono = Share_Tech_Mono({
  weight: '400',
})

export default function Home() {
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
