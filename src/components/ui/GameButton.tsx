import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

export function GameButton({ children, className = '', variant = 'primary', ...props }: GameButtonProps) {
  return (
    <button className={`game-button game-button--${variant} ${className}`} type="button" {...props}>
      <span>{children}</span>
    </button>
  )
}
