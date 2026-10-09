import Button from './components/Button.jsx'
import ProgressChip from './components/ProgressChip.jsx'
import StarMark from './components/StarMark.jsx'
import Surface from './components/Surface.jsx'

function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="On the Horizon home">
          <StarMark className="brand-mark" />
          <span>on the horizon</span>
        </a>
        <span className="topbar-note">A little closer, every day</span>
      </header>

      <section className="welcome-layout" id="home">
        <div className="welcome-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> YOUR FUTURE, IN FOCUS</p>
          <h1>Make room for<br />what <span>moves you.</span></h1>
          <p className="welcome-description">
            Give your next big thing a name, a picture, and a plan. Then watch it come into focus.
          </p>
          <div className="welcome-actions">
            <Button>Start a goal <span aria-hidden="true">↗</span></Button>
            <span className="quiet-note">Your goals stay on this device.</span>
          </div>
        </div>

        <Surface className="preview-card">
          <div className="preview-head">
            <div>
              <p className="preview-kicker">YOUR NEXT CHAPTER</p>
              <h2>Somewhere<br />you’ve dreamed of.</h2>
            </div>
            <ProgressChip>38% in focus</ProgressChip>
          </div>
          <div className="preview-art" aria-label="Abstract blurred landscape preview" role="img">
            <div className="sun-glow" />
            <div className="horizon-line horizon-back" />
            <div className="horizon-line horizon-front" />
            <StarMark className="art-star" />
          </div>
          <div className="preview-footer">
            <span><span className="status-dot" /> Your picture gets clearer as you save</span>
            <span className="preview-arrow" aria-hidden="true">↗</span>
          </div>
        </Surface>
      </section>

      <footer className="page-footer">
        <span>Money as light.</span>
        <span>Made for the things you’re looking forward to <span className="footer-star">✦</span></span>
      </footer>
    </main>
  )
}

export default App
