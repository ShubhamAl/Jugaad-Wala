import type { ReactNode } from 'react'

interface ModalProps {
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-panel" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}>×</button>
        <p className="eyebrow">GARAGE NOTICE</p>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  )
}
