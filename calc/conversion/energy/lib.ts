/**
 * Energy conversion — every factor is the number of joules in exactly one unit.
 *
 * Base unit: joule (J), the SI derived unit of energy.
 *
 * Factors marked "exact" are definitions (SI prefix arithmetic or units
 * defined via exact constants like the elementary charge e). Measured
 * factors cite their source (CODATA 2022, IAU 2015).
 */

const ENERGY_UNITS = {
  /* ---------- SI multiples of the joule (exact) ---------- */
  pJ: { factor: 1e-12, name: 'picojoule' },
  nJ: { factor: 1e-9, name: 'nanojoule' },
  uJ: { factor: 1e-6, name: 'microjoule' },
  mJ: { factor: 1e-3, name: 'millijoule' },
  J: { factor: 1, name: 'joule' },
  kJ: { factor: 1e3, name: 'kilojoule' },
  MJ: { factor: 1e6, name: 'megajoule' },
  GJ: { factor: 1e9, name: 'gigajoule' },
  TJ: { factor: 1e12, name: 'terajoule' },
  PJ: { factor: 1e15, name: 'petajoule' },
  EJ: { factor: 1e18, name: 'exajoule' },

  /* ---------- Calorie-based units ----------
   * th = thermochemical (1 cal_th = 4.184 J, exact)
   * IT = International Table (1 cal_IT = 4.1868 J, exact, 5th CGPM 1954) */
  cal: { factor: 4.184, name: 'calorie (thermochemical)' },
  kcal: { factor: 4.184e3, name: 'kilocalorie (thermochemical)' },
  Cal: { factor: 4.184e3, name: 'food Calorie (= kcal)' },
  cal_IT: { factor: 4.1868, name: 'calorie (International Table)' },
  kcal_IT: { factor: 4.1868e3, name: 'kilocalorie (International Table)' },

  /* ---------- Electrical energy units (exact: 1 W·s = 1 J, 3600 s/h) ---------- */
  mWh: { factor: 3.6, name: 'milliwatt-hour' },
  Wh: { factor: 3.6e3, name: 'watt-hour' },
  kWh: { factor: 3.6e6, name: 'kilowatt-hour' },
  MWh: { factor: 3.6e9, name: 'megawatt-hour' },
  GWh: { factor: 3.6e12, name: 'gigawatt-hour' },
  TWh: { factor: 3.6e15, name: 'terawatt-hour' },

  /* ---------- Electronvolt units ----------
   * Exact via e = 1.602176634e-19 C (SI 2019 definition) */
  meV: { factor: 1.602176634e-22, name: 'millielectronvolt' },
  eV: { factor: 1.602176634e-19, name: 'electronvolt' },
  keV: { factor: 1.602176634e-16, name: 'kiloelectronvolt' },
  MeV: { factor: 1.602176634e-13, name: 'megaelectronvolt' },
  GeV: { factor: 1.602176634e-10, name: 'gigaelectronvolt' },
  TeV: { factor: 1.602176634e-7, name: 'teraelectronvolt' },

  /* ---------- TNT equivalent ----------
   * Convention (exact): 1 g TNT = 1000 cal_th = 4184 J */
  gTNT: { factor: 4.184e3, name: 'gram of TNT' },
  tonTNT: { factor: 4.184e9, name: 'ton of TNT' },
  ktTNT: { factor: 4.184e12, name: 'kiloton of TNT' },
  MtTNT: { factor: 4.184e15, name: 'megaton of TNT' },
  GtTNT: { factor: 4.184e18, name: 'gigaton of TNT' },

  /* ---------- Imperial / US customary ---------- */
  BTU: { factor: 1055.05585262, name: 'British thermal unit (IT)' }, // exact
  BTU_th: { factor: 1054.35026448, name: 'British thermal unit (th)' }, // exact derivation
  ftlbf: { factor: 1.3558179483314004, name: 'foot-pound force' }, // exact
  inlbf: { factor: 0.1129848290276167, name: 'inch-pound force' }, // exact (ftlbf / 12)
  hph: { factor: 2.684519537696172e6, name: 'horsepower-hour (mechanical)' }, // exact: 550 ft·lbf/s × 3600 s
  therm: { factor: 1.05506e8, name: 'therm (EC)' }, // exact: 100,000 BTU_IT
  therm_US: { factor: 1.054804e8, name: 'therm (US)' }, // ≈, via BTU_59°F
  quad: { factor: 1.05505585262e18, name: 'quad (quadrillion BTU)' }, // exact: 1e15 BTU_IT

  /* ---------- Physics ---------- */
  erg: { factor: 1e-7, name: 'erg (CGS)' }, // exact
  Ry: {
    factor: 2.1798723611035e-18,
    name: 'Rydberg energy (hcR∞)',
  }, // CODATA 2022
  Eh: {
    factor: 4.3597447222071e-18,
    name: 'Hartree energy',
  }, // CODATA 2022, = 2 Ry
  Planck: {
    factor: 1.9561e9,
    name: 'Planck energy',
  }, // CODATA 2022 — only 5 significant digits are known (limited by G)
  Lsun_s: {
    factor: 3.828e26,
    name: 'solar second (L☉·s)',
  }, // IAU 2015 nominal luminosity — energy the Sun radiates in 1 second
} as const

export type EnergyUnit = keyof typeof ENERGY_UNITS

function assertUnit<T extends Record<string, unknown>>(
  table: T,
  unit: string,
  label: string
): void {
  if (!(unit in table)) {
    throw new Error(`Unknown ${label}: ${unit}`)
  }
}

export function convertEnergy(
  value: number,
  from: EnergyUnit,
  to: EnergyUnit
): number {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Value must be finite, got ${value}`)
  }
  assertUnit(ENERGY_UNITS, from, 'energy unit')
  assertUnit(ENERGY_UNITS, to, 'energy unit')
  const inJoules = value * ENERGY_UNITS[from].factor
  const result = inJoules / ENERGY_UNITS[to].factor
  // Strip float noise (e.g. 3600.0000000000005) without losing real precision.
  return Number(result.toPrecision(15))
}

/** Human-friendly output across the ~45 orders of magnitude in this table. */
export function formatEnergy(value: number, sigDigits = 6): string {
  if (!Number.isFinite(value)) return String(value)
  if (value === 0) return '0'
  const abs = Math.abs(value)
  if (abs >= 1e15 || abs < 1e-6) {
    return value.toExponential(sigDigits - 1)
  }
  return String(Number(value.toPrecision(sigDigits)))
}

/** Unit metadata for building UI selects, grouped for display. */
export const ENERGY_UNIT_LIST = Object.entries(ENERGY_UNITS).map(
  ([symbol, { name }]) => ({ symbol, name })
)
