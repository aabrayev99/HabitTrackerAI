'use client';

import React from 'react';
import { Flame, ClipboardList } from 'lucide-react';

// Modern SaaS Habit Status Badge
const StatusBadge = ({ active }: { active: boolean }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
    ${active
      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
      : 'bg-gray-800 text-gray-400 border border-gray-700'
    }`}>
    {active ? 'Active' : 'Paused'}
  </span>
);

export function HabitList({ habits, onHabitUpdated }: any) {
  const [loadingHabits, setLoadingHabits] = React.useState<Set<string>>(new Set())

  const toggleHabitForToday = async (habitId: string, currentStatus: boolean) => {
    const today = new Date().toISOString().split('T')[0]
    setLoadingHabits(prev => new Set([...prev, habitId]))

    try {
      const response = await fetch(`/api/habits/${habitId}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: today,
          completed: !currentStatus,
        }),
      })

      if (response.ok) {
        onHabitUpdated()
      }
    } catch (error) {
      console.error('Error toggling habit:', error)
    } finally {
      setLoadingHabits(prev => {
        const newSet = new Set(prev)
        newSet.delete(habitId)
        return newSet
      })
    }
  }

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Удалить эту привычку?')) return

    try {
      await fetch(`/api/habits/${habitId}`, { method: 'DELETE' })
      onHabitUpdated()
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#0a0a0a]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase font-semibold">
              <th className="px-6 py-4 w-16 text-center">Статус</th>
              <th className="px-6 py-4">Название привычки</th>
              <th className="px-6 py-4 text-center hidden md:table-cell">Стрик</th>
              <th className="px-6 py-4 text-right hidden md:table-cell">Прогресс</th>
              <th className="px-6 py-4 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {habits.map((habit: any) => {
              const todayEntry = habit.entries?.find(
                (e: any) => e.date.split('T')[0] === today
              )
              const isCompleted = todayEntry?.completed || false
              const isLoading = loadingHabits.has(habit.id)

              return (
                <tr key={habit.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleHabitForToday(habit.id, isCompleted)}
                      disabled={isLoading}
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 border 
                                  ${isCompleted
                          ? 'bg-purple-600 border-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]'
                          : 'bg-transparent border-gray-600 text-transparent hover:border-purple-400'
                        }`}
                    >
                      {isLoading ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-600'}`}></div>
                      <div>
                        <div className={`text-sm font-medium text-white transition-opacity ${isCompleted ? 'opacity-60 line-through decoration-gray-500' : ''}`}>
                          {habit.title}
                        </div>
                        <div className="text-xs text-gray-500">{habit.description || 'Ежедневная цель'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center hidden md:table-cell">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs font-mono text-gray-300">
                      <Flame className="w-3.5 h-3.5 text-orange-500" strokeWidth={1.5} /> {habit.currentStreak}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          style={{ width: `${habit.completionRate || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{habit.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {habits.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <div className="flex justify-center mb-2 opacity-20"><ClipboardList className="w-10 h-10" strokeWidth={1} /></div>
            <p className="text-sm">Список пуст. Добавьте новую привычку.</p>
          </div>
        )}
      </div>
    </div>
  )
}
