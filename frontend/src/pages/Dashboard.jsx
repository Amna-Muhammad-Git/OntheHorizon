import Button from '../components/Button.jsx'
import BrandMark from '../components/BrandMark.jsx'
import GoalCard from '../features/goals/GoalCard.jsx'

function Dashboard({ goals = [], onCreateGoal, onAddMoney, onOpenGoal, onReset }) {
  const hasGoals = goals.length > 0

  return (
    <main className="app-shell dashboard-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="On the Horizon home">
          <BrandMark />
          <span>on the horizon</span>
        </a>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> YOUR SAVINGS GALLERY</p>
            <h1>Your horizons<span className="heading-period">.</span></h1>
            <p className="dashboard-subtitle">The things you’re looking forward to, coming into focus.</p>
          </div>
          {hasGoals && <Button onClick={onCreateGoal}>New goal <span aria-hidden="true">＋</span></Button>}
        </div>

        {hasGoals ? (
          <div className="goal-grid">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onAddMoney={onAddMoney} onOpen={onOpenGoal} />
            ))}
            <button className="new-goal-tile" onClick={onCreateGoal}>
              <span className="new-goal-plus">＋</span>
              <span>Add another horizon</span>
            </button>
          </div>
        ) : (
          <section className="empty-gallery">
            <div className="empty-art" aria-hidden="true">
              <BrandMark className="empty-brand-mark" />
              <div className="coin-pile coin-pile-left"><i /><i /><i /><i /><b>$</b></div>
              <div className="coin-pile coin-pile-right"><i /><i /><i /><b>$</b></div>
              <div className="coin-pile coin-pile-small"><i /><i /><b>$</b></div>
            </div>
            <p className="empty-kicker">EVERY BIG THING STARTS SOMEWHERE</p>
            <h2>Start with one goal.</h2>
            <p className="empty-description">Choose something you’re looking forward to, add its photo, and give it a savings plan.</p>
            <Button onClick={onCreateGoal}>Create your first goal <span aria-hidden="true">↗</span></Button>
          </section>
        )}
      </section>

      <footer className="page-footer">
        <span>Goals are personal. Your data stays on this device.</span>
        <span className="footer-actions"><span>Progress, made visible <span className="footer-star">✦</span></span><button type="button" className="reset-data-button" onClick={onReset}>Reset app data</button></span>
      </footer>
    </main>
  )
}

export default Dashboard
