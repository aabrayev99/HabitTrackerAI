import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const createHabitSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(100),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'custom']).default('daily'),
  tags: z.array(z.string()).default([]),
  endDate: z.string().optional(),
})

// GET /api/habits - получить все привычки пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      include: {
        entries: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // последние 30 дней
            },
          },
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Вычисляем streak для каждой привычки
    const habitsWithStats = habits.map((habit) => {
      const entries = habit.entries
      let currentStreak = 0

      // Считаем текущий streak
      const today = new Date()
      const todayString = today.toISOString().split('T')[0]
      let date = new Date(today)

      while (true) {
        const dateString = date.toISOString().split('T')[0]
        const entry = entries.find(e => e.date.toISOString().split('T')[0] === dateString)

        if (entry?.completed) {
          currentStreak++
        } else if (dateString !== todayString) {
          // Если не сегодня и не выполнено, останавливаем подсчет
          break
        } else {
          // Сегодня еще можно выполнить
          break
        }

        date.setDate(date.getDate() - 1)
      }

      // Вычисляем процент выполнения за последние 30 дней
      const completedEntries = entries.filter(e => e.completed).length
      const totalDays = Math.min(30, Math.ceil((Date.now() - new Date(habit.startDate).getTime()) / (24 * 60 * 60 * 1000)))
      const completionRate = totalDays > 0 ? Math.round((completedEntries / totalDays) * 100) : 0

      return {
        ...habit,
        currentStreak,
        completionRate,
        entries, // Включаем записи для фронтенда
      }
    })

    return NextResponse.json(habitsWithStats)
  } catch (error) {
    console.error('Get habits error:', error)
    return NextResponse.json(
      { message: 'Ошибка получения привычек' },
      { status: 500 }
    )
  }
}

// POST /api/habits - создать новую привычку
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = createHabitSchema.parse(body)

    const habit = await prisma.habit.create({
      data: {
        title: parsed.title,
        description: parsed.description,
        frequency: parsed.frequency,
        tags: parsed.tags,
        endDate: parsed.endDate ? new Date(parsed.endDate) : undefined,
        userId: session.user.id,
      },
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Неверные данные', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Create habit error:', error)
    return NextResponse.json(
      { message: 'Ошибка создания привычки' },
      { status: 500 }
    )
  }
}