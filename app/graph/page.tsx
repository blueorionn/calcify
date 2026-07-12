import type { Metadata } from 'next'
import CommingSoon from '@/components/pages/CommingSoon'

export const metadata: Metadata = {
  title: 'Graphing Calculator | Calcify',
}

export default function Page() {
  return (
    <>
      <CommingSoon />
    </>
  )
}
