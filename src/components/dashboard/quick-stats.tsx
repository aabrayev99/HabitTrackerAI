import { Card, CardBody } from "@heroui/react"

interface QuickStatsProps {
  habits: any[]
}

export function QuickStats({ habits }: QuickStatsProps) {
  const today = new Date().toISOString().split('T')[0]

  const stats = habits.reduce((acc, habit) => {
    const todayEntry = habit.entries?.find((e: any) =>
      e.date.split('T')[0] === today
    )

    if (todayEntry?.completed) {
      acc.completedToday++
    }

    acc.totalStreak += habit.currentStreak || 0
    acc.averageCompletion += habit.completionRate || 0

    return acc
  }, {
    completedToday: 0,
    totalStreak: 0,
    averageCompletion: 0,
  })

  const averageRate = habits.length > 0
    ? Math.round(stats.averageCompletion / habits.length)
    : 0

  const completionRate = habits.length > 0
    ? Math.round((stats.completedToday / habits.length) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Completed Today */}
      <Card shadow="sm">
        <CardBody className="flex flex-row items-center gap-4 p-4">
          <div className="flex items-center justify-center rounded-lg bg-success-100 p-3 text-2xl text-success-600">
            ✅
          </div>
          <div>
            <p className="text-small text-default-500">Выполнено сегодня</p>
            <p className="text-2xl font-bold">{stats.completedToday} <span className="text-small text-default-400">/ {habits.length}</span></p>
            <p className={`text-tiny font-medium ${completionRate >= 80 ? 'text-success' :
                completionRate >= 50 ? 'text-warning' : 'text-danger'
              }`}>
              {completionRate}% выполнения
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Active Habits */}
      <Card shadow="sm">
        <CardBody className="flex flex-row items-center gap-4 p-4">
          <div className="flex items-center justify-center rounded-lg bg-primary-100 p-3 text-2xl text-primary-600">
            🎯
          </div>
          <div>
            <p className="text-small text-default-500">Активные привычки</p>
            <p className="text-2xl font-bold">{habits.length}</p>
            <p className="text-tiny text-default-400">
              {habits.length === 0 ? 'Добавьте первую' : 'Отлично!'}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Best Streak */}
      <Card shadow="sm">
        <CardBody className="flex flex-row items-center gap-4 p-4">
          <div className="flex items-center justify-center rounded-lg bg-warning-100 p-3 text-2xl text-warning-600">
            🔥
          </div>
          <div>
            <p className="text-small text-default-500">Лучший стрик</p>
            <p className="text-2xl font-bold">{Math.max(...habits.map(h => h.currentStreak || 0), 0)} <span className="text-small text-default-400">дней</span></p>
            <p className="text-tiny text-default-400">Продолжайте!</p>
          </div>
        </CardBody>
      </Card>

      {/* Average Completion */}
      <Card shadow="sm">
        <CardBody className="flex flex-row items-center gap-4 p-4">
          <div className="flex items-center justify-center rounded-lg bg-secondary-100 p-3 text-2xl text-secondary-600">
            📊
          </div>
          <div>
            <p className="text-small text-default-500">Средний процент</p>
            <p className="text-2xl font-bold">{averageRate}%</p>
            <p className={`text-tiny font-medium ${averageRate >= 80 ? 'text-success' :
                averageRate >= 50 ? 'text-warning' : 'text-default-400'
              }`}>
              За последние 30 дней
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}