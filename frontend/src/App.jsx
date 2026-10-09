import { useEffect, useState } from 'react'
import CreateGoalSheet from './features/goals/CreateGoalSheet.jsx'
import TransactionSheet from './features/goals/TransactionSheet.jsx'
import { appendTransaction, createGoal, createTransaction } from './features/goals/goalModel.js'
import Dashboard from './pages/Dashboard.jsx'
import GoalDetail from './pages/GoalDetail.jsx'

const STORAGE_KEY = 'on-the-horizon-goals-v1'

function readGoals() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed.filter((goal) => goal && goal.id && goal.name).map((goal) => ({ ...goal, deposits: Array.isArray(goal.deposits) ? goal.deposits : [] })) : []
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
        setStorageWarning('This device is running low on browser storage. Try using a smaller photo.')
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
        />
      )}

      {storageWarning && <div className="storage-warning" role="status">{storageWarning}</div>}
      {sheet === 'create' && <CreateGoalSheet onClose={() => setSheet(null)} onCreate={saveGoal} />}
      {sheet === 'transaction' && activeGoal && <TransactionSheet goal={activeGoal} onClose={() => setSheet(null)} onSave={saveTransaction} />}
    </>
  )
}

export default App
