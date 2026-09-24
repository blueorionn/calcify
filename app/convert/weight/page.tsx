import type { Metadata } from 'next'
import ComingSoon from '@/components/pages/ComingSoon'
import FloatingNav from '@/components/FloatingNav'

export const metadata: Metadata = {
  title: 'Weight Conversion | Calcify',
}

export default function Page() {
  return (
    <>
      <FloatingNav name='Weight Conversion' />
      <ComingSoon />
    </>
  )
}
