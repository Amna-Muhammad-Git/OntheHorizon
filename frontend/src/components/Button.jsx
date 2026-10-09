function Button({ children, className = '', ...props }) {
  return (
    <button className={`button-primary ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

export default Button
