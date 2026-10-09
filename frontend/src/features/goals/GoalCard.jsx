import { goalSnapshot } from '../../utils/projection.js'
import Button from '../../components/Button.jsx'
import ProgressChip from '../../components/ProgressChip.jsx'
import StarMark from '../../components/StarMark.jsx'

const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function GoalCard({ goal, onAddMoney, onOpen }) {
  const snapshot = goalSnapshot(goal)
  const pictureStyle = {
    filter: snapshot.filter,
    transform: 'scale(1.06)',
  }

  return (
    <article className="goal-card">
      <button className="goal-picture-button" onClick={() => onOpen?.(goal)} aria-label={`View ${goal.name}`}>
        {goal.image ? (
          <img className="goal-picture" src={goal.image} alt="" style={pictureStyle} />
        ) : (
          <div className="goal-picture goal-picture-fallback" style={pictureStyle} aria-hidden="true">
            <span className="fallback-orb" />
            <span className="fallback-hill fallback-hill-back" />
            <span className="fallback-hill fallback-hill-front" />
          </div>
        )}
        <span className="goal-picture-scrim" />
        <span className="goal-card-topline">
          <span className="goal-image-label">IN THE MAKING</span>
          <ProgressChip>{Math.round(snapshot.progress)}%</ProgressChip>
        </span>
        <span className="goal-picture-title">{goal.name || 'Untitled goal'}</span>
        <StarMark className="goal-picture-star" />
      </button>

      <div className="goal-card-content">
        <div className="goal-amounts">
          <div>
            <span className="goal-meta-label">SAVED</span>
            <strong>{currency.format(snapshot.saved)}</strong>
          </div>
          <span className="amount-divider" aria-hidden="true">/</span>
          <div>
            <span className="goal-meta-label">TODAY’S PRICE</span>
            <strong>{currency.format(snapshot.price)}</strong>
          </div>
        </div>
        <div
          className="goal-progress-track"
          role="progressbar"
          aria-label={`${goal.name} savings progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(snapshot.progress)}
        >
          <span style={{ width: `${snapshot.progress}%` }} />
        </div>
        <Button className="goal-add-button" onClick={() => onAddMoney?.(goal)}>
          Add money <span aria-hidden="true">＋</span>
        </Button>
      </div>
    </article>
  )
}

export default GoalCard
