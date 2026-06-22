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
    <div className="text-xs text-anthracite/60">
      <div>{date}</div>
      <div className="tabular-nums">{time}</div>
      <div className="mt-0.5">44577 Castrop-Rauxel</div>
    </div>
  )
}
