import { useState } from 'react'
import BottomSheet from '../../components/BottomSheet.jsx'
import Button from '../../components/Button.jsx'
import { compressImage } from '../../utils/image.js'

function CreateGoalSheet({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [yearlyIncrease, setYearlyIncrease] = useState('6')
  const [priceDrift, setPriceDrift] = useState(true)
  const [image, setImage] = useState('')
  const [imageName, setImageName] = useState('')
  const [mode, setMode] = useState('fixed')
  const [amount, setAmount] = useState('50')
  const [period, setPeriod] = useState('week')
  const [daysChoice, setDaysChoice] = useState('365')
  const [customDays, setCustomDays] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const plannedDays = daysChoice === 'custom' ? Number(customDays) : Number(daysChoice)

  async function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    setBusy(true)
    try {
      const compressed = await compressImage(file)
      setImage(compressed)
      setImageName(file.name)
    } catch (imageError) {
      setError(imageError.message || 'Could not read that image. Try another one.')
      event.target.value = ''
    } finally {
      setBusy(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const cleanName = name.trim()
    const price = Number(basePrice)
    if (!cleanName || cleanName.length > 48) return setError('Give your goal a name up to 48 characters.')
    if (!Number.isFinite(price) || price <= 0) return setError('Enter a price greater than zero.')
    if (!image) return setError('Add a photo to bring this goal into focus.')
    if (mode === 'fixed' && (!Number.isFinite(Number(amount)) || Number(amount) <= 0)) {
      return setError('Enter an amount you can save each period.')
    }
    if (mode === 'target' && (!Number.isFinite(plannedDays) || plannedDays < 1 || plannedDays > 7300)) {
      return setError('Choose a plan between 1 and 7,300 days.')
    }

    setError('')
    onCreate({
      name: cleanName,
      basePrice: price,
      yearlyIncrease: Number(yearlyIncrease) || 0,
      priceDrift,
      image,
      plan: mode === 'fixed'
        ? { mode, amount: Number(amount), period }
        : { mode, days: Math.floor(plannedDays) },
    })
  }

  return (
    <BottomSheet title="Create a goal" description="Give something you’re looking forward to a name, price, and picture." onClose={onClose}>
      <form className="sheet-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>What are you saving for?</span>
          <input autoFocus maxLength={48} value={name} onChange={(event) => setName(event.target.value)} placeholder="A weekend in Tokyo" required />
        </label>

        <div className="form-row">
          <label className="form-field">
            <span>Price today</span>
            <div className="input-with-prefix"><span>$</span><input type="number" min="0.01" step="0.01" value={basePrice} onChange={(event) => setBasePrice(event.target.value)} placeholder="3,000" required /></div>
          </label>
          <label className="form-field">
            <span>Yearly price rise</span>
            <div className="input-with-suffix"><input type="number" min="0" max="1000" step="0.1" value={yearlyIncrease} onChange={(event) => setYearlyIncrease(event.target.value)} /><span>%</span></div>
          </label>
        </div>

        <label className={`photo-picker ${image ? 'has-image' : ''}`}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image ? (
            <>
              <img src={image} alt="" />
              <span className="photo-picker-copy"><strong>{imageName}</strong><small>Tap to change photo</small></span>
            </>
          ) : (
            <span className="photo-picker-copy"><strong>{busy ? 'Preparing your photo…' : 'Choose a goal photo'}</strong><small>Resized to fit on this device</small></span>
          )}
          <span className="photo-picker-icon" aria-hidden="true">＋</span>
        </label>

        <label className="toggle-row">
          <span><strong>Let the price rise over time</strong><small>Uses your yearly estimate in every projection.</small></span>
          <input type="checkbox" checked={priceDrift} onChange={(event) => setPriceDrift(event.target.checked)} />
        </label>

        <fieldset className="plan-fieldset">
          <legend>Your savings plan</legend>
          <div className="mode-switch" role="group" aria-label="Choose a savings plan">
            <button type="button" className={mode === 'fixed' ? 'selected' : ''} onClick={() => setMode('fixed')}>Save an amount</button>
            <button type="button" className={mode === 'target' ? 'selected' : ''} onClick={() => setMode('target')}>Pick a date</button>
          </div>
          {mode === 'fixed' ? (
            <div className="form-row plan-input-row">
              <label className="form-field"><span>I can save</span><div className="input-with-prefix"><span>$</span><input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /></div></label>
              <label className="form-field"><span>Every</span><select value={period} onChange={(event) => setPeriod(event.target.value)}><option value="day">day</option><option value="week">week</option><option value="month">month</option></select></label>
            </div>
          ) : (
            <div className="form-row plan-input-row">
              <label className={`form-field ${daysChoice !== 'custom' ? 'field-wide' : ''}`}><span>I want to reach it in</span><select value={daysChoice} onChange={(event) => setDaysChoice(event.target.value)}><option value="30">30 days</option><option value="90">90 days</option><option value="180">180 days</option><option value="365">365 days</option><option value="custom">Custom</option></select></label>
              {daysChoice === 'custom' && <label className="form-field"><span>Number of days</span><input type="number" min="1" max="7300" value={customDays} onChange={(event) => setCustomDays(event.target.value)} placeholder="240" /> </label>}
            </div>
          )}
        </fieldset>

        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit" className="sheet-submit" disabled={busy}>{busy ? 'Preparing photo…' : 'Create this goal'} <span aria-hidden="true">↗</span></Button>
      </form>
    </BottomSheet>
  )
}

export default CreateGoalSheet
