import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const updateHabitSchema = z.object({
  title: z.string().min(1, 'Название обязательно').max(100).optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'custom']).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  endDate: z.string().optional(),
})

// GET /api/habits/[id] - получить конкретную привычку
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

    const habit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        entries: {
          where: {
            date: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    })

    if (!habit) {
      return NextResponse.json(
        { message: 'Привычка не найдена' },
        { status: 404 }
      )
    }

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Get habit error:', error)
    return NextResponse.json(
      { message: 'Ошибка получения привычки' },
      { status: 500 }
    )
  }
}

// PUT /api/habits/[id] - обновить привычку
export async function PUT(
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
    const parsed = updateHabitSchema.parse(body)

    const updateData: any = { ...parsed }
    if (parsed.endDate) {
      updateData.endDate = new Date(parsed.endDate)
    }

    // Проверяем, что привычка принадлежит пользователю
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingHabit) {
      return NextResponse.json(
        { message: 'Привычка не найдена' },
        { status: 404 }
      )
    }

    const updatedHabit = await prisma.habit.update({
      where: {
        id: params.id,
      },
      data: updateData,
    })

    return NextResponse.json(updatedHabit)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Неверные данные', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Update habit error:', error)
    return NextResponse.json(
      { message: 'Ошибка обновления привычки' },
      { status: 500 }
    )
  }
}

// DELETE /api/habits/[id] - удалить привычку
export async function DELETE(
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

    // Проверяем, что привычка принадлежит пользователю
    const existingHabit = await prisma.habit.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingHabit) {
      return NextResponse.json(
        { message: 'Привычка не найдена' },
        { status: 404 }
      )
    }

    // Мягкое удаление - устанавливаем isActive в false
    await prisma.habit.update({
      where: {
        id: params.id,
      },
      data: {
        isActive: false,
      },
    })

    return NextResponse.json({ message: 'Привычка удалена' })
  } catch (error) {
    console.error('Delete habit error:', error)
    return NextResponse.json(
      { message: 'Ошибка удаления привычки' },
      { status: 500 }
    )
  }
}