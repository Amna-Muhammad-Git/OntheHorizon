function BrandMark({ className = '' }) {
  return (
    <span className={`brand-orbit-mark ${className}`.trim()} aria-hidden="true">
      <span className="brand-orbit brand-orbit-one" />
      <span className="brand-orbit brand-orbit-two" />
    </span>
  )
}

export default BrandMark
