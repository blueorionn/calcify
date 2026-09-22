# Calcify

A fast, clean, offline-capable calculator suite — basic, scientific, BMI and
currency — built with **Next.js 16**, **React 19**, **shadcn/ui (radix-nova)**
and **mathjs**, installable as a PWA.

## Philosophy

- **Pure logic, thin UI.** Every calculator's brain is a pure reducer function,
  completely decoupled from React. The UI is a thin shell that dispatches
  actions — which is why 165+ unit tests cover the core without ever rendering
  a component.
- **Self-contained calculators.** Each calculator lives in its own module with
  its logic, components and tests colocated. Adding or removing one never
  touches the others.
- **No global state.** Calculator state stays local; the only shared context is
  the theme.
- **Keyboard-first.** Every operation is reachable from the keyboard.
- **Offline-first.** Calcify is an installable PWA. Everything works offline —
  only live exchange rates need a connection.
- **Safe math.** Expressions are evaluated through mathjs on a constrained
  grammar — never raw `eval` — and errors surface as inline alerts, not
  crashes.

## Calculators

| Calculator                                    | Status    |
| --------------------------------------------- | --------- |
| **Basic** (arithmetic + memory)               | ✅ Live   |
| **Scientific** (trig, log, powers, factorial) | ✅ Live   |
| **Graph** (plot equations)                    | 🔜 Coming |
| **BMI** (body mass index)                     | ✅ Live   |
| **Currency Conversion** (live exchange rates) | ✅ Live   |
| **Weight Conversion** (kg, lb, oz, …)         | 🔜 Coming |
| **Energy Conversion** (J, cal, kWh, …)        | 🔜 Coming |
| **Speed Conversion** (km/h, mph, kn, …)       | 🔜 Coming |
| _More to be announced_                        | —         |

## Usage

### Basic (`/arithmetic`)

Everyday arithmetic with operation chaining, percent, sign toggle and a memory
register (MC · MR · M+ · M−).

### Scientific (`/scientific`)

Full expression editing with parentheses, trigonometry (including inverse
functions), logarithms, powers and roots, factorial, absolute value and
inverse. Switch between degrees and radians, and watch the raw expression
render as proper math — `*` becomes `×`, `sqrt(` becomes `√`, `sin^-1(`
becomes `sin⁻¹(`. Backspace is token-aware: it removes `asin(` or `^2` in one
tap instead of character by character.

### BMI (`/bmi`)

Metric or imperial units with a live result, category (underweight → obese)
and color scale.

### Currency (`/currency`)

Live exchange rates from [Frankfurter](https://frankfurter.dev) (ECB reference
rates) across ~30 currencies, with flag display, one-tap swap and debounced
input. The only calculator that needs a connection.

## Features

- 📱 **Installable PWA** — add Calcify to your home screen; all calculators
  work offline
- ⌨️ **Full keyboard support** on Basic and Scientific
- 🌗 **Dark & light themes** — persisted across visits, synced between tabs
- 🧮 **Pretty-printed expressions** in Scientific
- 🪶 **Minimal dependencies** — no state library, no runtime CSS framework

## Tech Stack

| Layer     | Technology                                                     |
| --------- | -------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)                             |
| UI        | React 19 + React Compiler, shadcn/ui (radix-nova)              |
| Icons     | lucide-react                                                   |
| Math      | mathjs (safe evaluation)                                       |
| Styling   | Tailwind CSS v4                                                |
| PWA       | Serwist (precaching, runtime caching, offline fallback)        |
| Testing   | Vitest                                                         |
| Tooling   | TypeScript · ESLint · Prettier · pnpm                          |

## License

[Apache License 2.0](LICENSE)
