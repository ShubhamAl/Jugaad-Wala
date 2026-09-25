import type { CustomerExpression } from '../../types/game'

interface CustomerCharacterProps {
  expression: CustomerExpression
  name: string
}

export function CustomerCharacter({ expression, name }: CustomerCharacterProps) {
  return (
    <div className={`customer-placeholder customer-placeholder--${expression}`} aria-label={`${name}, ${expression}`}>
      <div className="customer-hair" />
      <div className="customer-ear customer-ear--left" />
      <div className="customer-ear customer-ear--right" />
      <div className="customer-face">
        <span className="customer-eye customer-eye--left" />
        <span className="customer-eye customer-eye--right" />
        <span className="customer-nose" />
        <span className="customer-mouth" />
      </div>
      <div className="customer-neck" />
      <div className="customer-shirt"><span>R</span></div>
      <small>PLACEHOLDER PORTRAIT</small>
    </div>
  )
}
