# Calcify

A fast, clean, responsive calculator built with **Next.js 16**, **React 19**, **shadcn/ui (radix-nova)**, and **mathjs**.

## Calculators

| Calculator                                    | Status    |
| --------------------------------------------- | --------- |
| **Basic** (arithmetic + memory)               | ✅ Live   |
| **Scientific** (trig, log, sqrt, etc.)        | 🔜 Coming |
| **Graph** (plot equations)                    | 🔜 Coming |
| **BMI** (body mass index)                     | 🔜 Coming |
| **Currency Conversion** (live exchange rates) | 🔜 Coming |
| _More to be announced_                        | —         |

## Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Next.js 16 (App Router)               |
| UI        | React 19, shadcn/ui (radix-nova)      |
| Icons     | lucide-react                          |
| Math      | mathjs (safe evaluation)              |
| Styling   | Tailwind CSS v4                       |
| Fonts     | Geist (UI), Share Tech Mono (display) |
| Testing   | Vitest                                |

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```bash
calcify/
├── app/
│   ├── globals.css          # Theme variables (light + dark)
│   ├── layout.tsx           # Root layout with ThemeProvider
│   └── page.tsx             # Home page rendering the calculator
├── calc/
│   └── ArithmeticCalculator.tsx   # Calculator component with reducer + keyboard handler
├── components/
│   ├── Header.tsx           # App header with theme toggle + GitHub link
│   ├── calc/
│   │   └── Button.tsx       # All button components (Digit, Operation, Clear, etc.)
│   └── ui/
│       └── button.tsx       # shadcn Button component
├── context/
│   └── ThemeContext.tsx      # Theme provider (useSyncExternalStore + localStorage)
├── core/
│   ├── arithmetic.ts        # Reducer + actions for calculator logic
│   └── arithmetic.test.ts   # Unit tests for the reducer
├── hooks/
│   ├── useCopyToClipboard.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
└── lib/
    └── utils.ts             # cn() helper (clsx + tailwind-merge)
```

## Testing

```bash
npm test          # run all tests once
npm run test:watch  # watch mode
```
