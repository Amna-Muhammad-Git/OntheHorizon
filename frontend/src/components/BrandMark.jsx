import StarMark from './StarMark.jsx'

function BrandMark({ className = '' }) {
  return (
    <span className={`brand-orbit-mark ${className}`.trim()} aria-hidden="true">
      <span className="brand-orbit brand-orbit-one" />
      <span className="brand-orbit brand-orbit-two" />
      <StarMark className="brand-center-star" />
    </span>
  )
}

export default BrandMark
