'use client'

import type { ReactNode } from 'react'

type ConfirmSubmitButtonProps = {
  message: string
  children: ReactNode
  className?: string
}

export function ConfirmSubmitButton({ message, children, className }: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault()
        }
      }}
      className={className}
    >
      {children}
    </button>
  )
}
