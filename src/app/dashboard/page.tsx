'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HabitList } from '@/components/habits/habit-list'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { AddHabitButton } from '@/components/habits/add-habit-button'
import { LayoutDashboard, CalendarDays, Target, Bot, Settings, Bell, Search, Droplets, Activity, Lightbulb } from 'lucide-react'

// Component: Modern Sidebar
const Sidebar = () => (
  <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#050505] border-r border-white/5 hidden lg:flex flex-col z-40">
    <div className="h-16 flex items-center px-6 border-b border-white/5">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg mr-3">
        Q
      </div>
      <span className="font-semibold text-white tracking-tight"><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Q</span>-Habit</span>
    </div>

    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Меню</div>

      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-purple-400 font-medium">
        <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} /> Дашборд
      </a>
      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
        <CalendarDays className="w-5 h-5" strokeWidth={1.5} /> Календарь
      </a>
      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
        <Target className="w-5 h-5" strokeWidth={1.5} /> Цели
      </a>
      <Link href="/chat" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
        <Bot className="w-5 h-5" strokeWidth={1.5} /> AI Ассистент
        <span className="ml-auto px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">New</span>
      </Link>

      <div className="mt-8 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Настройки</div>
      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
        <Settings className="w-5 h-5" strokeWidth={1.5} /> Аккаунт
      </a>
      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
        <Bell className="w-5 h-5" strokeWidth={1.5} /> Уведомления
      </a>
    </nav>

    <div className="p-4 border-t border-white/5">
      <div className="rounded-xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-4 border border-white/10 relative overflow-hidden">
        <h4 className="font-semibold text-white text-sm mb-1 relative z-10">Pro Plan</h4>
        <p className="text-xs text-gray-300 mb-3 relative z-10">Разблокируйте все возможности</p>
        <button className="w-full py-1.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-gray-200 transition-colors relative z-10">Upgrade</button>
        {/* Glow */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/30 rounded-full filter blur-xl"></div>
      </div>
    </div>
  </aside>
);

// Component: Modern Header
const Header = ({ user, signOut }: any) => (
  <header className="fixed lg:left-64 top-0 right-0 h-16 bg-[#030014]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-30 transition-all">
    <div className="text-sm breadcrumbs text-gray-400 hidden md:block">
      <ul>
        <li><a>Главная</a></li>
        <li><span className="text-white font-medium">Дашборд</span></li>
      </ul>
    </div>

    <div className="flex items-center gap-4 ml-auto">
      <div className="relative hidden sm:block">
        <input type="text" placeholder="Поиск..." className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50 w-64 transition-all" />
        <span className="absolute left-3 top-2 text-gray-500"><Search className="w-4 h-4" strokeWidth={1.5} /></span>
      </div>

      <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
        <Bell className="w-5 h-5" strokeWidth={1.5} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#030014]"></span>
      </button>

      <div className="flex items-center gap-3 pl-4 border-l border-white/10">
        <div className="text-right hidden md:block">
          <div className="text-xs font-medium text-white">{user?.name}</div>
          <div className="text-[10px] text-gray-500">Free Account</div>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[1px]">
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
              {user?.image ? <img src={user.image} alt="User" /> : <span className="text-xs font-bold text-white">{user?.name?.[0]}</span>}
            </div>
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-[#0a0a0a] border border-white/10 rounded-xl w-52 mt-4">
            <li><a className="text-xs hover:bg-white/5 text-gray-300">Профиль</a></li>
            <li><button onClick={() => signOut()} className="text-xs hover:bg-white/5 text-red-400">Выйти</button></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
);

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  useEffect(() => {
    if (session?.user) fetchHabits()
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
    return <div className="min-h-screen bg-[#030014] flex items-center justify-center"><div className="loading loading-spinner text-purple-500"></div></div>
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-purple-500 selection:text-white">
      <Sidebar />
      <Header user={session.user} signOut={signOut} />

      <main className="lg:pl-64 pt-20 p-6 min-h-screen bg-[url('/grid.svg')] bg-fixed" style={{ backgroundSize: '30px 30px' }}>
        {/* Page Title & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Обзор привычек</h1>
            <p className="text-sm text-gray-400 mt-1">Отслеживайте прогресс и достигайте целей.</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/5 text-white text-sm font-medium rounded-lg hover:bg-white/10 border border-white/10 transition-colors">
              Экспорт
            </button>
            <AddHabitButton onHabitAdded={fetchHabits} />
          </div>
        </div>

        <QuickStats habits={habits} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel: Habit List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-white">Текущие задачи</h3>
                <button className="text-xs text-purple-400 hover:text-white transition-colors">Показать все</button>
              </div>

              <HabitList habits={habits} onHabitUpdated={fetchHabits} />
            </div>
          </div>

          {/* Right Panel: Daily Overview / Widgets */}
          <div className="space-y-6">
            {/* Productivty Score Widget */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-[#0f0f0f] to-[#050505] p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all"></div>

              <h3 className="font-semibold text-white mb-4 relative z-10">Продуктивность</h3>
              <div className="flex items-end gap-2 mb-2 relative z-10">
                <div className="text-4xl font-bold text-white">84%</div>
                <div className="text-sm text-green-400 font-medium mb-1.5 ">+2.4%</div>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mb-4 relative z-10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-[84%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
              </div>
              <p className="text-xs text-gray-400 relative z-10">
                Вы более продуктивны, чем 85% пользователей на этой неделе. Так держать!
              </p>
            </div>

            {/* Calendar / Reminder Widget */}
            <div className="rounded-2xl border border-white/5 bg-[#0a0a0a]/50 p-6">
              <h3 className="font-semibold text-white mb-4">Напоминания</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Droplets className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Пить воду</div>
                    <div className="text-xs text-gray-500">14:00 • Ежедневно</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all">
                    <Activity className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Пробежка</div>
                    <div className="text-xs text-gray-500">18:30 • Ср, Пт</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip Card */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 text-center">
              <div className="flex justify-center mb-2"><Lightbulb className="w-7 h-7 text-amber-400" strokeWidth={1.5} /></div>
              <h4 className="font-semibold text-white text-sm mb-1">Совет дня</h4>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                "Маленькие шаги ведут к большим переменам. Не пытайтесь изменить всё сразу."
              </p>
              <button className="text-xs font-semibold text-white bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
                Читать больше
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}