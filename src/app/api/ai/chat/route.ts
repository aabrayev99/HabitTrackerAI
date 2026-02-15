import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const chatSchema = z.object({
  message: z.string().min(1, 'Сообщение не может быть пустым').max(1000),
  conversationId: z.string().nullish(),
})

// POST /api/ai/chat - отправить сообщение ИИ консультанту
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
    const { message, conversationId } = chatSchema.parse(body)

    // Получаем контекст пользователя - его привычки и статистику
    const habits = await prisma.habit.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      include: {
        entries: {
          where: {
            date: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // последние 7 дней
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    })

    // Формируем контекст для ИИ
    const habitsSummary = habits.map(habit => {
      const completedThisWeek = habit.entries.filter(e => e.completed).length
      const totalDaysThisWeek = Math.min(7, Math.ceil((Date.now() - new Date(habit.startDate).getTime()) / (24 * 60 * 60 * 1000)))
      const weeklyRate = totalDaysThisWeek > 0 ? Math.round((completedThisWeek / totalDaysThisWeek) * 100) : 0
      
      return {
        name: habit.title,
        description: habit.description,
        frequency: habit.frequency,
        weeklyCompletionRate: weeklyRate,
        completedDaysThisWeek: completedThisWeek
      }
    }).filter(h => h.weeklyCompletionRate > 0 || h.completedDaysThisWeek > 0)

    // Системный промпт для ИИ
    const systemPrompt = `Ты — персональный консультант по формированию привычек. Твоя задача — мотивировать пользователей, давать полезные советы и помогать достигать целей.

Контекст пользователя:
- Активные привычки: ${habitsSummary.length > 0 ? JSON.stringify(habitsSummary, null, 2) : 'Пока нет активных привычек'}

Правила:
1. Отвечай на русском языке
2. Будь мотивирующим и поддерживающим
3. Давай конкретные, практические советы
4. Используй данные о привычках пользователя для персонализации ответов
5. Если у пользователя нет привычек, предложи начать с малого
6. Поощряй прогресс, даже небольшой
7. Предлагай научно-обоснованные методики формирования привычек`

    // Получаем или создаем разговор
    let conversation
    if (conversationId) {
      conversation = await prisma.aiConversation.findFirst({
        where: {
          id: conversationId,
          userId: session.user.id,
        },
      })
    }

    if (!conversation) {
      conversation = await prisma.aiConversation.create({
        data: {
          userId: session.user.id,
          messages: [],
        },
      })
    }

    const messages = conversation.messages as any[]
    
    // Добавляем новое сообщение пользователя
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    }
    
    messages.push(userMessage)

    // Подготавливаем сообщения для DeepSeek API
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10).map((msg: any) => ({ // последние 10 сообщений для контекста
        role: msg.role,
        content: msg.content
      }))
    ]

    // Отправляем запрос к DeepSeek API
    const deepSeekResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!deepSeekResponse.ok) {
      const error = await deepSeekResponse.text()
      console.error('DeepSeek API error:', error)
      
      return NextResponse.json(
        { 
          message: 'Извините, ИИ-консультант временно недоступен. Попробуйте позже.',
          error: 'API_ERROR'
        },
        { status: 500 }
      )
    }

    const deepSeekData = await deepSeekResponse.json()
    const aiResponse = deepSeekData.choices[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        { message: 'Не удалось получить ответ от ИИ-консультанта' },
        { status: 500 }
      )
    }

    // Добавляем ответ ИИ в разговор
    const aiMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    }
    
    messages.push(aiMessage)

    // Обновляем разговор в базе данных
    await prisma.aiConversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        messages: messages,
      },
    })

    return NextResponse.json({
      message: aiResponse,
      conversationId: conversation.id,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Неверные данные', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('AI chat error:', error)
    return NextResponse.json(
      { message: 'Ошибка при обращении к ИИ-консультанту' },
      { status: 500 }
    )
  }
}

// GET /api/ai/chat - получить историю разговоров
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')

    if (conversationId) {
      // Получить конкретный разговор
      const conversation = await prisma.aiConversation.findFirst({
        where: {
          id: conversationId,
          userId: session.user.id,
        },
      })

      if (!conversation) {
        return NextResponse.json(
          { message: 'Разговор не найден' },
          { status: 404 }
        )
      }

      return NextResponse.json(conversation)
    } else {
      // Получить все разговоры пользователя
      const conversations = await prisma.aiConversation.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 10, // последние 10 разговоров
      })

      return NextResponse.json(conversations)
    }

  } catch (error) {
    console.error('Get AI conversations error:', error)
    return NextResponse.json(
      { message: 'Ошибка получения разговоров' },
      { status: 500 }
    )
  }
}