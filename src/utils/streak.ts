interface HabitEntry {
  date: Date
  completed: boolean
}

export function calculateStreak(entries: HabitEntry[], today: Date = new Date()): number {
  if (entries.length === 0) return 0

  let streak = 0
  const todayString = today.toISOString().split('T')[0]
  let currentDate = new Date(today)

  while (true) {
    const dateString = currentDate.toISOString().split('T')[0]
    const entry = entries.find(e => e.date.toISOString().split('T')[0] === dateString)

    if (entry?.completed) {
      streak++
    } else if (dateString !== todayString) {
      // Если не сегодня и не выполнено, останавливаем подсчет
      break
    } else {
      // Сегодня еще можно выполнить, не прерываем streak
      break
    }

    currentDate.setDate(currentDate.getDate() - 1)
  }

  return streak
}

export function calculateCompletionRate(entries: HabitEntry[], days: number = 30): number {
  const completedEntries = entries.filter(e => e.completed).length
  return days > 0 ? Math.round((completedEntries / days) * 100) : 0
}