'use client'

import React from 'react'
import { Button } from '@heroui/react'
import NextLink from 'next/link'

interface AddHabitButtonProps {
  onHabitAdded?: () => void
}

export function AddHabitButton({ onHabitAdded }: AddHabitButtonProps) {
  // onHabitAdded is ignored here as we are navigating to a new page

  return (
    <Button
      as={NextLink}
      href="/dashboard/new-habit"
      color="primary"
      startContent={<span>+</span>}
    >
      Добавить привычку
    </Button>
  )
}
