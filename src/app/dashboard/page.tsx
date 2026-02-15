'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HabitList } from '@/components/habits/habit-list'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { AddHabitButton } from '@/components/habits/add-habit-button'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  User,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Link as HeroLink
} from "@heroui/react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchHabits()
    }
  }, [session])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      if (response.ok) {
        const data = await response.json()
        setHabits(data)
      }
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="Загрузка..." />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Navbar */}
      <Navbar maxWidth="xl" isBordered>
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit text-xl flex items-center gap-2">
            🎯 Трекер Привычек
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end" className="gap-4">
          <NavbarItem>
            <Button
              as={Link}
              href="/chat"
              color="secondary"
              variant="flat"
              startContent={<span>🤖</span>}
            >
              ИИ-Консультант
            </Button>
          </NavbarItem>
          <NavbarItem>
            <User
              name={session.user.name || 'Пользователь'}
              description={session.user.email}
              avatarProps={{
                src: session.user.image || undefined,
                name: session.user.name?.[0] || 'U'
              }}
            />
          </NavbarItem>
          <NavbarItem>
            <Button
              color="danger"
              variant="light"
              onPress={() => signOut({ callbackUrl: '/' })}
            >
              Выйти
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Привет, {session.user.name || 'пользователь'}! 👋
          </h1>
          <p className="text-default-500 mt-1">
            Давайте посмотрим на ваш прогресс сегодня
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStats habits={habits} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Habits Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex justify-between items-center px-6 py-4">
                <h3 className="text-xl font-bold">Ваши привычки</h3>
                <AddHabitButton onHabitAdded={fetchHabits} />
              </CardHeader>
              <CardBody className="px-6 py-4">
                {habits.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-default-300 text-6xl mb-4">🎯</div>
                    <h3 className="text-lg font-medium mb-2">
                      Пока нет привычек
                    </h3>
                    <p className="text-default-500 mb-6">
                      Создайте свою первую привычку, чтобы начать отслеживать прогресс
                    </p>
                    <AddHabitButton onHabitAdded={fetchHabits} />
                  </div>
                ) : (
                  <HabitList habits={habits} onHabitUpdated={fetchHabits} />
                )}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Progress */}
            <Card>
              <CardHeader className="px-6 py-4">
                <h3 className="text-lg font-bold">Прогресс сегодня</h3>
              </CardHeader>
              <CardBody className="px-6 py-4 flex flex-col gap-3">
                {habits.length > 0 ? (
                  habits.map((habit: any) => {
                    const today = new Date().toISOString().split('T')[0]
                    const todayEntry = habit.entries?.find(
                      (e: any) => e.date.split('T')[0] === today
                    )

                    return (
                      <div key={habit.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-default-100 transition-colors">
                        <span className="text-medium">{habit.title}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${todayEntry?.completed
                            ? 'bg-success-100 text-success-800'
                            : 'bg-default-100 text-default-800'
                          }`}>
                          {todayEntry?.completed ? 'Выполнено' : 'В планах'}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-small text-default-500">Добавьте привычки для отслеживания</p>
                )}
              </CardBody>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-gradient-to-br from-primary-50 to-background border-primary-100">
              <CardHeader className="px-6 py-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span>💡</span> Совет дня
                </h3>
              </CardHeader>
              <CardBody className="px-6 py-4">
                <p className="text-sm text-default-600 mb-4">
                  Начинайте с малого! Лучше выполнять привычку 5 минут каждый день,
                  чем планировать час и не делать совсем.
                </p>
                <HeroLink
                  as={Link}
                  href="/chat"
                  color="primary"
                  className="text-sm font-medium"
                  showAnchorIcon
                >
                  Получить совет от ИИ
                </HeroLink>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}