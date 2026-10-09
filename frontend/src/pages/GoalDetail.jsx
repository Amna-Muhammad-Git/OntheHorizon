import Button from '../components/Button.jsx'
import ProgressChip from '../components/ProgressChip.jsx'
import StarMark from '../components/StarMark.jsx'
import { fixedPlanResult, goalSnapshot, targetDatePlanResult } from '../utils/projection.js'

const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const wholeCurrency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function money(value) { return currency.format(value) }
function todayPlus(days) { const date = new Date(); date.setDate(date.getDate() + days); return date }
function displayDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`))
}
function duration(days) {
  if (days === 0) return 'now'
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'}`
  const months = Math.round(days / 30.44)
  if (months < 12) return `about ${months} ${months === 1 ? 'month' : 'months'}`
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  return `about ${years} ${years === 1 ? 'year' : 'years'}${remainingMonths ? ` and ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}` : ''}`
}

function GoalDetail({ goal, onBack, onAddMoney }) {
  const snapshot = goalSnapshot(goal)
  const plan = goal.plan ?? { mode: 'fixed', amount: 0, period: 'week' }
  const planResult = plan.mode === 'target'
    ? targetDatePlanResult(goal, plan.days)
    : fixedPlanResult(goal, plan.amount, plan.period)
  const previews = [
    { label: 'Today', date: new Date() },
    { label: 'In 6 months', date: todayPlus(182) },
    { label: 'In 1 year', date: todayPlus(365) },
  ].map((preview) => ({ ...preview, snapshot: goalSnapshot(goal, preview.date) }))
  const history = [...(goal.deposits ?? [])].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main className="app-shell detail-shell">
      <header className="topbar">
        <button className="back-button" onClick={onBack}><span aria-hidden="true">←</span> Gallery</button>
        <a className="brand" href="#home" aria-label="On the Horizon home"><StarMark className="brand-mark" /><span>on the horizon</span></a>
        <span className="topbar-note">Your horizon</span>
      </header>

      <section className="detail-content">
        <div className="detail-hero">
          <div className="detail-image-wrap">
            {goal.image && <img className="detail-image" src={goal.image} alt={`Photo for ${goal.name}`} style={{ filter: snapshot.filter }} />}
            {!goal.image && <div className="detail-image detail-image-fallback" style={{ filter: snapshot.filter }} />}
            <div className="detail-image-overlay" />
            <div className="detail-image-info">
              <p className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT CHAPTER</p>
              <h1>{goal.name}</h1>
              <span>{wholeCurrency.format(snapshot.saved)} saved of {wholeCurrency.format(snapshot.price)} today</span>
            </div>
            <ProgressChip>{Math.round(snapshot.progress)}% in focus</ProgressChip>
          </div>
          <div className="detail-summary">
            <div><span className="goal-meta-label">SAVED SO FAR</span><strong>{money(snapshot.saved)}</strong></div>
            <div><span className="goal-meta-label">PRICE TODAY</span><strong>{money(snapshot.price)}</strong></div>
            <div><span className="goal-meta-label">PLAN</span><strong>{plan.mode === 'target' ? `${plan.days} days` : `${money(plan.amount)} / ${plan.period}`}</strong></div>
            <Button onClick={() => onAddMoney(goal)}>Add money <span aria-hidden="true">＋</span></Button>
          </div>
        </div>

        <div className="detail-panels">
          <section className="detail-panel plan-panel">
            <div className="panel-heading">
              <div><p className="preview-kicker">YOUR PLAN</p><h2>Here’s the horizon.</h2></div>
              <StarMark className="panel-star" />
            </div>
            {plan.mode === 'target' ? (
              <>
                <p className="plan-result-copy">To reach this goal in <strong>{duration(planResult.days)}</strong>, put aside <strong>{money(planResult.perDay)} each day</strong>.</p>
                <div className="plan-stats"><div><span>Per week</span><strong>{money(planResult.perWeek)}</strong></div><div><span>Per month</span><strong>{money(planResult.perMonth)}</strong></div><div><span>Then it may cost</span><strong>{money(planResult.targetPrice)}</strong></div></div>
                <p className="waiting-note">Waiting adds about {money(planResult.costOfWaiting)} to today’s price.</p>
              </>
            ) : planResult.reached ? (
              <>
                <p className="plan-result-copy">At <strong>{money(plan.amount)} each {plan.period}</strong>, your goal may come into focus in <strong>{duration(planResult.days)}</strong>.</p>
                <div className="plan-stats"><div><span>Target date</span><strong>{displayDate(planResult.date)}</strong></div><div><span>Price then</span><strong>{money(planResult.price)}</strong></div><div><span>Waiting adds</span><strong>{money(planResult.costOfWaiting)}</strong></div></div>
              </>
            ) : (
              <p className="plan-result-copy">At this pace, the price may grow faster than your savings. Try increasing your regular amount.</p>
            )}
            <p className="estimate-note">These are estimates. Real prices may differ.</p>
          </section>

          <section className="detail-panel future-panel">
            <div className="panel-heading"><div><p className="preview-kicker">FUTURE YOU</p><h2>The picture, over time.</h2></div></div>
            <div className="future-previews">
              {previews.map(({ label, date, snapshot: future }) => (
                <div className="future-preview" key={label}>
                  <div className="future-preview-image">
                    {goal.image && <img src={goal.image} alt="" style={{ filter: future.filter }} />}
                    {!goal.image && <div className="future-fallback" style={{ filter: future.filter }} />}
                  </div>
                  <div className="future-preview-caption"><span>{label}</span><strong>{Math.round(future.progress)}%</strong></div>
                  <small>{wholeCurrency.format(future.price)} goal price</small>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="detail-panel history-panel">
          <div className="panel-heading"><div><p className="preview-kicker">YOUR MOMENTUM</p><h2>Money you’ve moved.</h2></div><span className="history-count">{history.length} {history.length === 1 ? 'entry' : 'entries'}</span></div>
          {history.length ? (
            <ul className="transaction-list">
              {history.map((transaction) => (
                <li key={transaction.id}>
                  <span className={`transaction-icon ${transaction.type === 'withdraw' ? 'is-withdrawal' : ''}`}>{transaction.type === 'withdraw' ? '−' : '+'}</span>
                  <span className="transaction-description"><strong>{transaction.type === 'withdraw' ? 'Withdrawal' : 'Deposit'}</strong><small>{displayDate(transaction.date)}</small></span>
                  <strong className={`transaction-amount ${transaction.type === 'withdraw' ? 'is-withdrawal' : ''}`}>{transaction.type === 'withdraw' ? '−' : '+'}{money(transaction.amount)}</strong>
                </li>
              ))}
            </ul>
          ) : <p className="history-empty">Your first deposit will show up here.</p>}
        </section>
      </section>

      <footer className="page-footer"><span>Projection based on your plan and price estimate.</span><span>Progress, made visible <span className="footer-star">✦</span></span></footer>
    </main>
  )
}

export default GoalDetail
