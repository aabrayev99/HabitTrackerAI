'use client'

import { useState } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Button, Checkbox, Chip, Tooltip, Progress } from "@heroui/react"

interface HabitListProps {
  habits: any[]
  onHabitUpdated: () => void
}

export function HabitList({ habits, onHabitUpdated }: HabitListProps) {
  const [loadingHabits, setLoadingHabits] = useState<Set<string>>(new Set())

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
    if (!confirm('Вы уверены, что хотите удалить эту привычку?')) {
      return
    }

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onHabitUpdated()
      }
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
      {habits.map((habit) => {
        const todayEntry = habit.entries?.find(
          (e: any) => e.date.split('T')[0] === today
        )
        const isCompleted = todayEntry?.completed || false
        const isLoading = loadingHabits.has(habit.id)

        return (
          <Card key={habit.id} className="w-full">
            <CardBody>
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    isSelected={isCompleted}
                    onValueChange={() => toggleHabitForToday(habit.id, isCompleted)}
                    isDisabled={isLoading}
                    color="success"
                    size="lg"
                  />
                  <div>
                    <h4 className={`text-large font-medium ${isCompleted ? 'line-through text-default-400' : ''}`}>{habit.title}</h4>
                    {habit.description && <p className="text-small text-default-500">{habit.description}</p>}

                    <div className="flex gap-2 mt-2">
                      <Chip size="sm" variant="flat" color="warning">🔥 {habit.currentStreak || 0} дней</Chip>
                      <Chip size="sm" variant="flat" color="primary">Completed: {habit.completionRate || 0}%</Chip>
                    </div>
                  </div>
                </div>
                <Button isIconOnly color="danger" variant="light" onPress={() => deleteHabit(habit.id)} size="sm">
                  🗑️
                </Button>
              </div>

              {/* Calendar visualization */}
              <div className="mt-4 flex gap-1 justify-end">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() - (6 - i))
                  const dateString = date.toISOString().split('T')[0]
                  const entry = habit.entries?.find((e: any) => e.date.split('T')[0] === dateString)
                  const isToday = dateString === today;

                  return (
                    <Tooltip key={i} content={`${date.toLocaleDateString()} - ${entry?.completed ? 'Выполнено' : 'Не выполнено'}`}>
                      <div
                        className={`w-3 h-3 rounded-full ${entry?.completed ? 'bg-success-500' : isToday ? 'bg-default-300 ring-2 ring-primary' : 'bg-default-200'
                          }`}
                      />
                    </Tooltip>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}
