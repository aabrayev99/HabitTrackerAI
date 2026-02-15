import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const habitEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты (YYYY-MM-DD)'),
  completed: z.boolean(),
  notes: z.string().optional(),
})

// POST /api/habits/[id]/entries - отметить выполнение привычки
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { date, completed, notes } = habitEntrySchema.parse(body)

    // Проверяем, что привычка принадлежит пользователю
    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!habit) {
      return NextResponse.json(
        { message: 'Привычка не найдена' },
        { status: 404 }
      )
    }

    // Создаем или обновляем запись выполнения
    const entry = await prisma.habitEntry.upsert({
      where: {
        habitId_userId_date: {
          habitId: params.id,
          userId: session.user.id,
          date: new Date(date),
        },
      },
      create: {
        habitId: params.id,
        userId: session.user.id,
        date: new Date(date),
        completed,
        notes,
      },
      update: {
        completed,
        notes,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Неверные данные', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Create habit entry error:', error)
    return NextResponse.json(
      { message: 'Ошибка создания записи' },
      { status: 500 }
    )
  }
}

// GET /api/habits/[id]/entries - получить записи выполнения привычки
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Проверяем, что привычка принадлежит пользователю
    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!habit) {
      return NextResponse.json(
        { message: 'Привычка не найдена' },
        { status: 404 }
      )
    }

    const entries = await prisma.habitEntry.findMany({
      where: {
        habitId: params.id,
        userId: session.user.id,
        date: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Get habit entries error:', error)
    return NextResponse.json(
      { message: 'Ошибка получения записей' },
      { status: 500 }
    )
  }
}