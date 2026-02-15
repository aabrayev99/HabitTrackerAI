'use client'

import React from 'react'
import { CheckCircle2, TrendingUp, Target, Flame } from 'lucide-react'

interface QuickStatsProps {
  habits: any[]
}

const StatCard = ({ title, value, prefix, suffix, color, icon }: any) => (
  <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 p-5 hover:border-white/10 transition-all group">
    {/* Background Glow */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>

    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-2 rounded-lg bg-white/5 text-white/80">
        {icon}
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/5 ${color.replace('bg-', 'text-')}`}>
        {suffix}
      </span>
    </div>

    <div className="relative z-10">
      <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</div>
      <div className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-1">
        {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
        {value}
      </div>
    </div>
  </div>
)

export function QuickStats({ habits }: QuickStatsProps) {
  const today = new Date().toISOString().split('T')[0]

  const stats = habits.reduce((acc, habit) => {
    const todayEntry = habit.entries?.find((e: any) =>
      e.date.split('T')[0] === today
    )
    if (todayEntry?.completed) acc.completedToday++
    acc.totalStreak += habit.currentStreak || 0
    return acc
  }, {
    completedToday: 0,
    totalStreak: 0,
  })

  // Calculations
  const completionRate = habits.length > 0
    ? Math.round((stats.completedToday / habits.length) * 100)
    : 0

  const bestStreak = Math.max(...habits.map(h => h.currentStreak || 0), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Выполнено сегодня"
        value={stats.completedToday}
        suffix="Daily"
        color="bg-purple-500"
        icon={<CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />}
      />
      <StatCard
        title="Эффективность"
        value={completionRate}
        prefix="%"
        color={completionRate > 50 ? "bg-green-500" : "bg-yellow-500"}
        suffix={completionRate > 80 ? "+12%" : "-2%"}
        icon={<TrendingUp className="w-5 h-5" strokeWidth={1.5} />}
      />
      <StatCard
        title="Активные цели"
        value={habits.length}
        suffix="Total"
        color="bg-blue-500"
        icon={<Target className="w-5 h-5" strokeWidth={1.5} />}
      />
      <StatCard
        title="Лучшая серия"
        value={bestStreak}
        suffix="Days"
        color="bg-orange-500"
        icon={<Flame className="w-5 h-5" strokeWidth={1.5} />}
      />
    </div>
  )
}