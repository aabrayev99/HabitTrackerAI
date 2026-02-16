'use client'

import React from 'react'
import { CheckCircle2, TrendingUp, Target, Flame } from 'lucide-react'

interface QuickStatsProps {
  habits: any[]
}

const StatCard = ({ title, value, prefix, suffix, color, icon }: any) => (
  <div className="relative overflow-hidden rounded-[28px] bg-white/[0.03] border border-white/5 p-6 hover:border-white/20 transition-all duration-500 group hover:scale-[1.02] shadow-xl">
    {/* Background Glow */}
    <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${color} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity duration-700`}></div>

    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="p-3 rounded-2xl bg-white/5 text-white/90 border border-white/5 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 flex flex-col items-end">
        <span className={`${color.replace('bg-', 'text-')} mb-0.5`}>{suffix}</span>
        <span className="opacity-50">Trend</span>
      </div>
    </div>

    <div className="relative z-10">
      <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</div>
      <div className="text-4xl font-black text-white tracking-tighter flex items-baseline gap-1.5" style={{ letterSpacing: '-0.05em' }}>
        {prefix && <span className="text-xl text-gray-600 font-bold">{prefix}</span>}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatCard
        title="Выполнено сегодня"
        value={stats.completedToday}
        suffix="+2"
        color="bg-purple-500"
        icon={<CheckCircle2 className="w-5 h-5" strokeWidth={2} />}
      />
      <StatCard
        title="Эффективность"
        value={completionRate}
        prefix="%"
        color={completionRate > 50 ? "bg-green-500" : "bg-yellow-500"}
        suffix={completionRate > 80 ? "S+" : "C-"}
        icon={<TrendingUp className="w-5 h-5" strokeWidth={2} />}
      />
      <StatCard
        title="Активные цели"
        value={habits.length}
        suffix="Total"
        color="bg-blue-500"
        icon={<Target className="w-5 h-5" strokeWidth={2} />}
      />
      <StatCard
        title="Лучший стрик"
        value={bestStreak}
        suffix="Days"
        color="bg-orange-500"
        icon={<Flame className="w-5 h-5" strokeWidth={2} />}
      />
    </div>
  )
}