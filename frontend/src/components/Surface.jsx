function Surface({ children, className = '', ...props }) {
  return (
    <div className={`surface-card ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}

export default Surface
