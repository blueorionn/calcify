import type { Metadata } from 'next'
import CommingSoon from '@/components/pages/CommingSoon'
import FloatingNav from '@/components/FloatingNav'

export const metadata: Metadata = {
  title: 'Graphing Calculator | Calcify',
}

export default function Page() {
  return (
    <>
      <FloatingNav name='Graph' />
      <CommingSoon />
    </>
  )
}
