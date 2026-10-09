import { useState } from 'react'
import BottomSheet from '../../components/BottomSheet.jsx'
import Button from '../../components/Button.jsx'
import { goalSnapshot } from '../../utils/projection.js'

function localToday() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

function TransactionSheet({ goal, onClose, onSave }) {
  const [type, setType] = useState('add')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(localToday())
  const [error, setError] = useState('')
  const available = goalSnapshot(goal).saved

  function handleSubmit(event) {
    event.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return setError('Enter an amount greater than zero.')
    if (type === 'withdraw' && value > available) return setError('You can withdraw up to the amount saved so far.')
    if (!date || date > localToday()) return setError('Choose today or a date in the past.')
    if (date < goal.createdAt) return setError('Choose a date on or after you created this goal.')
    onSave({ amount: value, type, date })
  }

  return (
    <BottomSheet title={type === 'add' ? 'Add money' : 'Withdraw money'} description={`${goal.name} · ${new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(available)} saved`} onClose={onClose}>
      <form className="sheet-form" onSubmit={handleSubmit}>
        <div className="mode-switch transaction-switch" role="group" aria-label="Transaction type">
          <button type="button" className={type === 'add' ? 'selected' : ''} onClick={() => { setType('add'); setError('') }}>Add money</button>
          <button type="button" className={type === 'withdraw' ? 'selected' : ''} onClick={() => { setType('withdraw'); setError('') }}>Withdraw</button>
        </div>
        <label className="form-field">
          <span>Amount</span>
          <div className="input-with-prefix input-large"><span>$</span><input autoFocus type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" required /></div>
        </label>
        <label className="form-field">
          <span>Date</span>
          <input type="date" value={date} min={goal.createdAt} max={localToday()} onChange={(event) => setDate(event.target.value)} required />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" className="sheet-submit">{type === 'add' ? 'Save deposit' : 'Save withdrawal'} <span aria-hidden="true">↗</span></Button>
      </form>
    </BottomSheet>
  )
}

export default TransactionSheet
