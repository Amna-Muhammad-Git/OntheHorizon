import { useEffect, useState } from 'react'
import CreateGoalSheet from './features/goals/CreateGoalSheet.jsx'
import TransactionSheet from './features/goals/TransactionSheet.jsx'
import { appendTransaction, createGoal, createTransaction } from './features/goals/goalModel.js'
import Dashboard from './pages/Dashboard.jsx'
import GoalDetail from './pages/GoalDetail.jsx'

const STORAGE_KEY = 'on-the-horizon-goals-v1'

function normalizeGoal(goal) {
  if (!goal || typeof goal !== 'object' || typeof goal.id !== 'string' || typeof goal.name !== 'string') return null
  const name = goal.name.trim()
  const basePrice = Number(goal.basePrice)
  if (!name || !Number.isFinite(basePrice) || basePrice <= 0) return null

  const validPeriods = ['day', 'week', 'month']
  const storedPlan = goal.plan && typeof goal.plan === 'object' ? goal.plan : {}
  const plan = storedPlan.mode === 'target'
    ? { mode: 'target', days: Math.max(1, Math.min(7300, Math.floor(Number(storedPlan.days) || 365))) }
    : {
        mode: 'fixed',
        amount: Math.max(0, Number(storedPlan.amount) || 0),
        period: validPeriods.includes(storedPlan.period) ? storedPlan.period : 'week',
      }
  const deposits = Array.isArray(goal.deposits) ? goal.deposits.filter((transaction) => (
    transaction &&
    (transaction.type === 'add' || transaction.type === 'withdraw') &&
    Number.isFinite(Number(transaction.amount)) && Number(transaction.amount) > 0 &&
    typeof transaction.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(transaction.date)
  )) : []

  return {
    id: goal.id,
    name,
    basePrice,
    yearlyIncrease: Math.min(1000, Math.max(0, Number(goal.yearlyIncrease) || 0)),
    priceDrift: goal.priceDrift !== false,
    createdAt: typeof goal.createdAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(goal.createdAt) ? goal.createdAt : new Date().toISOString().slice(0, 10),
    image: typeof goal.image === 'string' ? goal.image : '',
    deposits: deposits.map((transaction) => ({
      id: typeof transaction.id === 'string' ? transaction.id : `${transaction.date}-${transaction.type}-${transaction.amount}`,
      amount: Number(transaction.amount),
      date: transaction.date,
      type: transaction.type,
    })),
    plan,
  }
}

function readGoals() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed.map(normalizeGoal).filter(Boolean) : []
  } catch {
    return []
  }
}

function App() {
  const [goals, setGoals] = useState(readGoals)
  const [screen, setScreen] = useState('dashboard')
  const [activeGoalId, setActiveGoalId] = useState(null)
  const [sheet, setSheet] = useState(null)
  const [storageWarning, setStorageWarning] = useState('')
  const activeGoal = goals.find((goal) => goal.id === activeGoalId)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
        setStorageWarning('')
      } catch {
        setStorageWarning('Could not save to this browser. Try a smaller photo or allow site storage in your browser settings.')
      }
    }, 400)
    return () => window.clearTimeout(timeout)
  }, [goals])

  function openTransaction(goal) {
    setActiveGoalId(goal.id)
    setSheet('transaction')
  }

  function saveGoal(input) {
    const goal = createGoal(input)
    setGoals((current) => [goal, ...current])
    setSheet(null)
  }

  function saveTransaction({ amount, type, date }) {
    const transaction = createTransaction(amount, type, date)
    setGoals((current) => current.map((goal) => goal.id === activeGoalId ? appendTransaction(goal, transaction) : goal))
    setSheet(null)
  }

  function openGoal(goal) {
    setActiveGoalId(goal.id)
    setScreen('detail')
  }

  function resetAppData() {
    const confirmed = window.confirm('Delete all saved goals, photos, and transaction history from this browser?')
    if (!confirmed) return
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      setStorageWarning('')
    } catch {
      setStorageWarning('Browser storage could not be cleared. Remove the app data from your browser settings.')
    }
    setGoals([])
    setActiveGoalId(null)
    setSheet(null)
    setScreen('dashboard')
  }

  return (
    <>
      {screen === 'detail' && activeGoal ? (
        <GoalDetail goal={activeGoal} onBack={() => setScreen('dashboard')} onAddMoney={openTransaction} />
      ) : (
        <Dashboard
          goals={goals}
          onCreateGoal={() => setSheet('create')}
          onAddMoney={openTransaction}
          onOpenGoal={openGoal}
          onReset={resetAppData}
        />
      )}

      {storageWarning && <div className="storage-warning" role="status">{storageWarning}</div>}
      {sheet === 'create' && <CreateGoalSheet onClose={() => setSheet(null)} onCreate={saveGoal} />}
      {sheet === 'transaction' && activeGoal && <TransactionSheet goal={activeGoal} onClose={() => setSheet(null)} onSave={saveTransaction} />}
    </>
  )
}

export default App
