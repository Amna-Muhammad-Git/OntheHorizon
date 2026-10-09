export const MAX_PROJECTION_DAYS = 7300
export const DAYS_PER_WEEK = 7
export const DAYS_PER_MONTH = 30.44

/** Count calendar days between two values, using local dates for Date objects. */
export function daysBetween(start, end = new Date()) {
  const startDay = utcDayNumber(start)
  const endDay = utcDayNumber(end)
  if (!Number.isFinite(startDay) || !Number.isFinite(endDay)) return 0
  return Math.max(0, endDay - startDay)
}

export function daysSinceCreated(goal, asOf = new Date()) {
  return daysBetween(goal.createdAt, asOf)
}

/** Project today's price using yearlyIncrease as a percentage. */
export function priceAt(basePrice, yearlyIncrease = 0, days = 0, priceDrift = true) {
  const base = nonNegative(basePrice)
  const elapsedDays = Math.max(0, finiteNumber(days))
  const annualRate = Math.max(-100, finiteNumber(yearlyIncrease)) / 100
  if (!priceDrift || elapsedDays === 0 || annualRate === 0) return base
  return base * (1 + annualRate) ** (elapsedDays / 365)
}

export function priceToday(goal, asOf = new Date()) {
  return priceAt(
    goal.basePrice,
    goal.yearlyIncrease,
    daysSinceCreated(goal, asOf),
    goal.priceDrift !== false,
  )
}

/** Deposits and withdrawals are applied in date order; balance cannot fall below zero. */
export function savedAmount(transactions = []) {
  const ordered = transactions
    .map((transaction, index) => ({ transaction, index }))
    .sort((a, b) => dateSortValue(a.transaction.date) - dateSortValue(b.transaction.date) || a.index - b.index)

  return ordered.reduce((balance, { transaction }) => {
    const amount = nonNegative(transaction.amount)
    return transaction.type === 'withdraw'
      ? Math.max(0, balance - amount)
      : balance + amount
  }, 0)
}

export function progressPercent(saved, price) {
  const target = nonNegative(price)
  if (target === 0) return 100
  return clamp((nonNegative(saved) / target) * 100, 0, 100)
}

/** Map progress to the photo's blur and grayscale CSS values. */
export function imageClarity(progress) {
  const percentage = clamp(finiteNumber(progress), 0, 100)
  return {
    blurPx: 25 - percentage * 0.25,
    grayscalePercent: 100 - percentage,
    filter: `blur(${25 - percentage * 0.25}px) grayscale(${100 - percentage}%)`,
  }
}

/** Current derived values for a goal, with no visual values persisted. */
export function goalSnapshot(goal, asOf = new Date()) {
  const elapsedDays = daysSinceCreated(goal, asOf)
  const price = priceAt(goal.basePrice, goal.yearlyIncrease, elapsedDays, goal.priceDrift !== false)
  const saved = savedAmount(goal.deposits)
  const progress = progressPercent(saved, price)

  return {
    elapsedDays,
    price,
    saved,
    progress,
    ...imageClarity(progress),
  }
}

/** Estimate when fixed contributions first catch up with a drifting price. */
export function fixedPlanResult(goal, amount, period = 'week', asOf = new Date()) {
  const contributionPerDay = nonNegative(amount) / periodDays(period)
  const elapsedDays = daysSinceCreated(goal, asOf)
  const startingSaved = savedAmount(goal.deposits)
  const startingPrice = priceAt(goal.basePrice, goal.yearlyIncrease, elapsedDays, goal.priceDrift !== false)

  if (startingSaved >= startingPrice) {
    return { reached: true, days: 0, date: localDateAfter(asOf, 0), price: startingPrice, saved: startingSaved, costOfWaiting: 0 }
  }
  if (contributionPerDay <= 0) return { reached: false, days: null, reason: 'no-contributions' }

  for (let futureDays = 1; futureDays <= MAX_PROJECTION_DAYS; futureDays += 1) {
    const futurePrice = priceAt(
      goal.basePrice,
      goal.yearlyIncrease,
      elapsedDays + futureDays,
      goal.priceDrift !== false,
    )
    const futureSaved = startingSaved + contributionPerDay * futureDays
    if (futureSaved >= futurePrice) {
      return {
        reached: true,
        days: futureDays,
        date: localDateAfter(asOf, futureDays),
        price: futurePrice,
        saved: futureSaved,
        costOfWaiting: Math.max(0, futurePrice - startingPrice),
        contributionPerDay,
      }
    }
  }

  return { reached: false, days: null, reason: 'price-outpaces-savings' }
}

/** Work out the daily, weekly, and monthly saving needed to finish in N days. */
export function targetDatePlanResult(goal, numberOfDays, asOf = new Date()) {
  const days = Math.floor(nonNegative(numberOfDays))
  if (days === 0) return { reachable: false, reason: 'invalid-duration' }

  const elapsedDays = daysSinceCreated(goal, asOf)
  const saved = savedAmount(goal.deposits)
  const startingPrice = priceAt(goal.basePrice, goal.yearlyIncrease, elapsedDays, goal.priceDrift !== false)
  const targetPrice = priceAt(goal.basePrice, goal.yearlyIncrease, elapsedDays + days, goal.priceDrift !== false)
  const needed = Math.max(0, targetPrice - saved)
  const perDay = needed / days

  return {
    reachable: true,
    days,
    targetDate: localDateAfter(asOf, days),
    startingPrice,
    targetPrice,
    saved,
    needed,
    perDay,
    perWeek: perDay * DAYS_PER_WEEK,
    perMonth: perDay * DAYS_PER_MONTH,
    costOfWaiting: Math.max(0, targetPrice - startingPrice),
  }
}

function periodDays(period) {
  if (period === 'day') return 1
  if (period === 'week') return DAYS_PER_WEEK
  if (period === 'month') return DAYS_PER_MONTH
  return 1
}

function utcDayNumber(value) {
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (match) return Math.floor(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / 86400000)
  }
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return Number.NaN
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000)
}

function localDateAfter(value, days) {
  const date = value instanceof Date ? new Date(value) : new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function dateSortValue(value) {
  const day = utcDayNumber(value)
  return Number.isFinite(day) ? day : Number.MAX_SAFE_INTEGER
}

function nonNegative(value) { return Math.max(0, finiteNumber(value)) }
function finiteNumber(value) { const number = Number(value); return Number.isFinite(number) ? number : 0 }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)) }
