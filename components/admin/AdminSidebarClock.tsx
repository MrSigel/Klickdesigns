'use client'

import { useState, useEffect } from 'react'

export default function AdminSidebarClock() {
  const [dateTime, setDateTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const date = dateTime.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const time = dateTime.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="text-center text-xs leading-tight text-anthracite/60">
      <div>{date} • {time}</div>
      <div className="mt-1">44577 Castrop-Rauxel</div>
    </div>
  )
}
