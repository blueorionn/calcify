/**
 * Convert an ISO 3166-1 alpha-2 country code to its Unicode flag emoji.
 */
export function countryCodeToFlag(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  )
}

/**
 * Map a currency code (ISO 4217) to its flag emoji.
 */
export function currencyToFlag(currency: string): string {
  // Supranational and special overrides
  const overrides: Record<string, string> = {
    EUR: 'EU', // Eurozone
    XCG: 'CW', // Caribbean Guilder — Curaçao
  }

  // Commodities and supra-national codes that have no flag
  const noFlag = new Set([
    'XAG', // Silver
    'XAU', // Gold
    'XPD', // Palladium
    'XPT', // Platinum
    'XDR', // Special Drawing Rights
    'XAF', // Central African CFA Franc (multi-country)
    'XOF', // West African CFA Franc (multi-country)
    'XCD', // East Caribbean Dollar (multi-country)
    'XPF', // CFP Franc (French overseas territories)
  ])

  if (noFlag.has(currency)) return ''

  const country = overrides[currency] ?? currency.slice(0, 2)
  return countryCodeToFlag(country)
}

/** Shape of a currency entry from the Frankfurter v2 API. */
export interface CurrencyEntry {
  iso_code: string
  name: string
  symbol: string
}

const API_BASE = 'https://api.frankfurter.dev/v2'

/** Fetch the full currency list from the Frankfurter v2 API. */
export async function fetchCurrencies(): Promise<CurrencyEntry[]> {
  const res = await fetch(`${API_BASE}/currencies`)
  if (!res.ok) throw new Error(`Failed to fetch currencies (${res.status})`)
  return res.json()
}

/**
 * Return a formatted label for use in a select dropdown:
 */
export function currencyLabel(entry: CurrencyEntry): string {
  const flag = currencyToFlag(entry.iso_code)
  const prefix = flag ? `${flag} ` : ''
  return `${prefix}${entry.iso_code} — ${entry.name}`
}

/**
 * Fetch the exchange rate between two currencies from the v2 API.
 * Returns { rate, date } or throws on failure.
 */
export async function fetchRate(
  base: string,
  quote: string
): Promise<{ rate: number; date: string }> {
  const res = await fetch(`${API_BASE}/rate/${base}/${quote}`)
  if (!res.ok) throw new Error(`Failed to fetch rate (${res.status})`)
  const data = await res.json()
  return { rate: data.rate, date: data.date }
}
