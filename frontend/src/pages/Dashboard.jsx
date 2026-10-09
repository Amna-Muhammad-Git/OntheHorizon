import Button from '../components/Button.jsx'
import StarMark from '../components/StarMark.jsx'
import GoalCard from '../features/goals/GoalCard.jsx'

function Dashboard({ goals = [], onCreateGoal, onAddMoney, onOpenGoal }) {
  const hasGoals = goals.length > 0

  return (
    <main className="app-shell dashboard-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="On the Horizon home">
          <StarMark className="brand-mark" />
          <span>on the horizon</span>
        </a>
        <span className="topbar-note">Money as light.</span>
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
              <span className="empty-orbit orbit-one" />
              <span className="empty-orbit orbit-two" />
              <StarMark className="empty-star" />
            </div>
            <p className="empty-kicker">EVERY BIG THING STARTS SOMEWHERE</p>
            <h2>What are you<br />looking forward to?</h2>
            <p className="empty-description">A trip, a first car, a day you’ve been dreaming about. Give it a picture and a plan.</p>
            <Button onClick={onCreateGoal}>Create your first goal <span aria-hidden="true">↗</span></Button>
          </section>
        )}
      </section>

      <footer className="page-footer">
        <span>Goals are personal. Your data stays on this device.</span>
        <span>Progress, made visible <span className="footer-star">✦</span></span>
      </footer>
    </main>
  )
}

export default Dashboard
