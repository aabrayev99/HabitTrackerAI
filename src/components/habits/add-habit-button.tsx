'use client'

import React from 'react'
import Link from 'next/link'

interface AddHabitButtonProps {
  onHabitAdded?: () => void
}

export function AddHabitButton({ onHabitAdded }: AddHabitButtonProps) {
  return (
    <Link href="/dashboard/new-habit" className="btn btn-primary btn-sm sm:btn-md">
      + Добавить привычку
    </Link>
  )
}
