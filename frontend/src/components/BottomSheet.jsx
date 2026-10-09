import { useEffect } from 'react'

function BottomSheet({ title, description, onClose, children }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="sheet-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-heading">
          <div>
            <h2 id="sheet-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default BottomSheet
