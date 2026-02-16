'use client'

import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

interface AddHabitButtonProps {
  onHabitAdded?: () => void
}

export function AddHabitButton({ onHabitAdded }: AddHabitButtonProps) {
  return (
    <Link
      href="/dashboard/new-habit"
      className="h-12 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-[1.05] transition-all cursor-pointer"
    >
      <Plus className="w-4 h-4" strokeWidth={3} />
      Добавить привычку
    </Link>
  )
}
