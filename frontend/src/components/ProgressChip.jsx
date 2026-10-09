function ProgressChip({ children, className = '' }) {
  return <span className={`progress-chip ${className}`.trim()}>{children}</span>
}

export default ProgressChip
