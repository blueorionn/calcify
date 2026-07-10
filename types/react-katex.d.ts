declare module 'react-katex' {
  import type { ComponentType } from 'react'

  interface KaTeXProps {
    math: string
    block?: boolean
    errorColor?: string
    renderError?: (error: Error) => React.ReactNode
    settings?: Record<string, unknown>
  }

  export const InlineMath: ComponentType<KaTeXProps>
  export const BlockMath: ComponentType<KaTeXProps>
}
