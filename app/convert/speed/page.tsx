import type { Metadata } from 'next'
import ComingSoon from '@/components/pages/ComingSoon'
import FloatingNav from '@/components/FloatingNav'

export const metadata: Metadata = {
  title: 'Speed Conversion | Calcify',
}

export default function Page() {
  return (
    <>
      <FloatingNav name='Speed Conversion' />
      <ComingSoon />
    </>
  )
}
