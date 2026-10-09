/**
 * Create a new goal with the fields used by the browser-only prototype.
 * @param {{name: string, basePrice: number, image?: string, yearlyIncrease?: number, priceDrift?: boolean, plan?: object}} input
 * @returns {object}
 */
export function createGoal(input) {
  const today = localDateString()

  return {
    id: makeId(),
    name: String(input.name ?? '').trim(),
    basePrice: nonNegativeNumber(input.basePrice),
    yearlyIncrease: nonNegativeNumber(input.yearlyIncrease ?? 6),
    priceDrift: input.priceDrift ?? true,
    createdAt: today,
    image: input.image ?? '',
    deposits: [],
    plan: input.plan ?? { mode: 'fixed', amount: 50, period: 'week' },
  }
}

/** Add a signed transaction record. Amounts are stored as positive values. */
export function createTransaction(amount, type = 'add', date = localDateString()) {
  if (type !== 'add' && type !== 'withdraw') {
    throw new Error('Transaction type must be "add" or "withdraw".')
  }

  return {
    id: makeId(),
    amount: nonNegativeNumber(amount),
    date: localDateString(date),
    type,
  }
}

/** Return a copy of a goal with the transaction appended. */
export function appendTransaction(goal, transaction) {
  return { ...goal, deposits: [...(goal.deposits ?? []), transaction] }
}

function nonNegativeNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.max(0, number) : 0
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function localDateString(value = new Date()) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
