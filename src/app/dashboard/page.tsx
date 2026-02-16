'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HabitList } from '@/components/habits/habit-list'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { AddHabitButton } from '@/components/habits/add-habit-button'
import {
  LayoutDashboard, CalendarDays, Target, Bot, Settings, Bell, Search,
  Droplets, Activity, Lightbulb, X, ChevronLeft, ChevronRight,
  Check, Minus, Filter, Plus, Pencil, Trash2, Save, User, Mail, Shield, LogOut, Flame, CheckCircle2, Calendar, Camera
} from 'lucide-react'

// =============================================
// SIDEBAR — fixed, no scroll on its own body
// =============================================
const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) => (
  <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#050505] border-r border-white/5 hidden lg:flex flex-col z-40">
    <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] text-xl">Q</div>
        <span className="text-xl font-bold tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">Q-Habit</span>
        </span>
      </Link>
    </div>

    <nav className="flex-1 p-5 space-y-2 overflow-y-auto mt-4">
      <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Основное</div>

      <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold ${activeTab === 'dashboard' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
        <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} /> Дашборд
      </button>
      <button onClick={() => setActiveTab('calendar')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold ${activeTab === 'calendar' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
        <CalendarDays className="w-5 h-5" strokeWidth={1.5} /> Календарь
      </button>
      <button onClick={() => setActiveTab('goals')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold ${activeTab === 'goals' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
        <Target className="w-5 h-5" strokeWidth={1.5} /> Цели
      </button>

      <div className="mt-8 px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Ассистент</div>
      <Link href="/chat" className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold border border-transparent">
        <Bot className="w-5 h-5" strokeWidth={1.5} /> AI Помощник
        <span className="ml-auto px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">New</span>
      </Link>

      <div className="mt-8 px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Настройки</div>
      <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold ${activeTab === 'profile' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}>
        <Settings className="w-5 h-5" strokeWidth={1.5} /> Профиль
      </button>
    </nav>

    <div className="p-5 border-t border-white/5 shrink-0">
      <div className="rounded-2xl bg-[#0a0a0a] p-5 border border-white/10 relative overflow-hidden group">
        <label className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block mb-1">Q-Habit Pro</label>
        <h4 className="font-bold text-white text-sm mb-3">Премиум доступ</h4>
        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all">Улучшить план</button>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-purple-600/20 rounded-full blur-[30px] group-hover:bg-purple-500/40 transition-colors"></div>
      </div>
    </div>
  </aside>
);

// =============================================
// HEADER — linear layout, no dropdown
// =============================================
const Header = ({ user, signOut: doSignOut, activeTab, setActiveTab }: any) => {
  const tabNames: Record<string, string> = { dashboard: 'Главная', calendar: 'Календарь', goals: 'Мои Цели', profile: 'Личный кабинет' }
  return (
    <header className="fixed lg:left-64 top-0 right-0 h-20 bg-[#030014]/80 backdrop-blur-[20px] border-b border-white/5 flex items-center px-8 z-30">

      {/* Left: Breadcrumb */}
      <div className="text-sm text-gray-400 hidden md:flex items-center gap-3 font-medium shrink-0 mr-auto">
        <Link href="/" className="hover:text-white transition-all">Главная</Link>
        <span className="text-gray-700">/</span>
        <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-all">Дашборд</button>
        <span className="text-gray-700">/</span>
        <span className="text-white font-bold tracking-tight">{tabNames[activeTab] || 'Дашборд'}</span>
      </div>

      {/* Right: fixed group that never overlaps search */}
      <div className="flex items-center gap-4 shrink-0 ml-auto">
        {/* Search */}
        <div className="relative hidden xl:block group">
          <input type="text" placeholder="Поиск..." className="auth-input bg-white/5 border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 w-48 transition-all duration-500" />
          <span className="absolute left-3.5 top-3 text-gray-500 group-focus-within:text-purple-400 transition-colors"><Search className="w-4 h-4" strokeWidth={2} /></span>
        </div>

        {/* Bell */}
        <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-300">
          <Bell className="w-5 h-5" strokeWidth={1.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#030014] animate-pulse"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10"></div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-500 p-[1.5px] shadow-lg shadow-purple-500/20 shrink-0">
          <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
            {user?.image ? <img src={user.image} alt="User" className="w-full h-full object-cover" /> : <span className="text-xs font-black text-white">{user?.name?.[0]}</span>}
          </div>
        </div>

        {/* Name */}
        <span className="hidden sm:block text-sm font-bold text-white tracking-wide whitespace-nowrap">{user?.name}</span>

        {/* Profile link */}
        <button onClick={() => setActiveTab('profile')} className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-purple-400 transition-colors whitespace-nowrap">
          <User className="w-3.5 h-3.5" /> Профиль
        </button>

        {/* Logout */}
        <button onClick={() => doSignOut()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all whitespace-nowrap">
          <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Выйти</span>
        </button>
      </div>
    </header>
  )
}

// =============================================
// CALENDAR VIEW
// =============================================
function CalendarView({ habits }: { habits: any[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const getDayStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    let completed = 0
    let total = 0
    habits.forEach(h => {
      const entry = h.entries?.find((e: any) => e.date.split('T')[0] === dateStr)
      if (entry) { total++; if (entry.completed) completed++ }
    })
    if (total === 0) return 'none'
    if (completed === total) return 'done'
    if (completed > 0) return 'partial'
    return 'missed'
  }

  const today = new Date()
  const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  return (
    <div className="rounded-[32px] border border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm p-8 animate-[auth-entrance_0.5s_ease-out_both]">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-b from-white to-gray-500 text-transparent bg-clip-text tracking-tighter" style={{ letterSpacing: '-0.04em' }}>{monthNames[month]} {year}</h2>
          <p className="text-sm text-gray-500 font-medium tracking-wide mt-1 uppercase">Рекорд активности — {habits.length > 0 ? '92%' : '0%'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 hover:scale-105 active:scale-95"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 hover:scale-105 active:scale-95"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 mb-4">
        {dayNames.map(d => <div key={d} className="text-center text-xs font-black text-gray-500 uppercase tracking-[0.2em]">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} className="aspect-square"></div>)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const status = getDayStatus(day)
          const todayMarker = isToday(day)
          return (
            <div key={day} className={`group relative aspect-square flex flex-col items-center justify-center rounded-[20px] text-lg transition-all duration-300 border
              ${todayMarker ? 'bg-purple-600/10 border-purple-500/40' : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/5 hover:scale-105'}
              ${status === 'done' ? 'bg-green-500/10 border-green-500/20' : ''}
              ${status === 'missed' ? 'bg-red-500/5 border-red-500/10' : ''}
              ${status === 'partial' ? 'bg-yellow-500/5 border-yellow-500/10' : ''}
            `}>
              <span className={`font-black ${todayMarker ? 'text-purple-400' : 'text-gray-400'}`}>{day}</span>
              <div className="absolute bottom-2.5 flex gap-0.5">
                {status === 'done' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,1)]"></div>}
                {status === 'missed' && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                {status === 'partial' && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>}
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#0a0a0a]/90 backdrop-blur-md rounded-[20px] transition-opacity flex items-center justify-center text-[10px] font-bold text-gray-300 uppercase tracking-tighter pointer-events-none">
                {status === 'done' ? 'Все цели' : status === 'partial' ? 'Частично' : status === 'missed' ? 'Пропуск' : 'Нет данных'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================
// GOALS VIEW
// =============================================
function GoalsView({ habits, onHabitUpdated }: { habits: any[]; onHabitUpdated: () => void }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all')

  const today = new Date().toISOString().split('T')[0]
  const enriched = habits.map(h => {
    const todayEntry = h.entries?.find((e: any) => e.date.split('T')[0] === today)
    const completedToday = todayEntry?.completed || false
    const rate = h.completionRate || 0
    let status: 'active' | 'completed' | 'paused' = 'active'
    if (rate >= 100) status = 'completed'
    if (h.currentStreak === 0 && rate === 0) status = 'paused'
    return { ...h, completedToday, status }
  })

  const filtered = filter === 'all' ? enriched : enriched.filter(h => h.status === filter)

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
    completed: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]',
    paused: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
  const statusLabels: Record<string, string> = { active: 'Активна', completed: 'Достигнута', paused: 'Пауза' }

  return (
    <div className="animate-[auth-entrance_0.5s_ease-out_both]">
      <div className="flex items-center gap-3 mb-10 flex-wrap">
        <div className="flex items-center gap-2 mr-2">
          <Filter className="w-5 h-5 text-purple-500" strokeWidth={2.5} />
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Фильтр:</span>
        </div>
        {(['all', 'active', 'completed', 'paused'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all border ${filter === f ? 'bg-purple-600/10 text-purple-300 border-purple-500/30 shadow-lg shadow-purple-500/5' : 'bg-white/5 text-gray-500 border-transparent hover:text-white hover:bg-white/10'}`}>
            {f === 'all' ? 'Все цели' : statusLabels[f]} {f !== 'all' && <span className="ml-2 px-2 py-0.5 rounded-lg bg-white/5 text-[10px]">{enriched.filter(h => h.status === f).length}</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(habit => (
          <div key={habit.id} className="relative group rounded-[32px] border border-white/5 bg-[#0a0a0a]/40 p-8 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center p-[2px] border ${habit.status === 'active' ? 'border-green-500/50' : 'border-gray-500/50'}`}>
                  <div className={`w-full h-full rounded-full ${habit.status === 'active' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]' : habit.status === 'completed' ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
                </div>
                <h3 className="text-base font-black text-white tracking-tight leading-none">{habit.title}</h3>
              </div>
              <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[habit.status]}`}>{statusLabels[habit.status]}</span>
            </div>

            <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium line-clamp-2 min-h-[40px]">{habit.description || 'Нет описания цели'}</p>

            {habit.endDate && (
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                Срок: <span className="text-white">{new Date(habit.endDate).toLocaleDateString('ru-RU')}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <span>Прогресс</span>
                  <span className="text-purple-400">{habit.completionRate || 0}%</span>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${habit.completionRate || 0}%` }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tighter border-t border-white/5 pt-5 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-orange-400">
                  <Flame className="w-4 h-4" /> {habit.currentStreak} дн. СТРИК
                </div>
                <div className="text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> {habit.entries?.length || 0} ДНЕЙ
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================
// EDITABLE HABIT LIST
// =============================================
function EditableHabitList({ habits, onHabitUpdated }: { habits: any[]; onHabitUpdated: () => void }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
  const [loadingHabits, setLoadingHabits] = useState<Set<string>>(new Set())

  const today = new Date().toISOString().split('T')[0]

  const startEditing = (habit: any) => {
    setEditingId(habit.id)
    setEditTitle(habit.title)
    setEditDesc(habit.description || '')
    setEditEndDate(habit.endDate ? new Date(habit.endDate).toISOString().split('T')[0] : '')
  }

  const saveEdit = async (habitId: string) => {
    try {
      await fetch(`/api/habits/${habitId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDesc,
          endDate: editEndDate || null
        })
      })
      setEditingId(null)
      onHabitUpdated()
    } catch (e) { console.error(e) }
  }

  const toggleHabit = async (habitId: string, currentStatus: boolean) => {
    setLoadingHabits(prev => new Set([...prev, habitId]))
    try {
      await fetch(`/api/habits/${habitId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, completed: !currentStatus })
      })
      onHabitUpdated()
    } catch (e) { console.error(e) }
    finally { setLoadingHabits(prev => { const s = new Set(prev); s.delete(habitId); return s }) }
  }

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Удалить эту привычку?')) return
    try { await fetch(`/api/habits/${habitId}`, { method: 'DELETE' }); onHabitUpdated() } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-6">
      {habits.map(habit => {
        const todayEntry = habit.entries?.find((e: any) => e.date.split('T')[0] === today)
        const isCompleted = todayEntry?.completed || false
        const isLoading = loadingHabits.has(habit.id)
        const isEditing = editingId === habit.id

        const deadlineDate = habit.endDate ? new Date(habit.endDate) : null
        const isOverdue = deadlineDate && deadlineDate < new Date() && !isCompleted

        return (
          <div key={habit.id} className={`group flex items-center gap-6 p-6 rounded-[28px] border transition-all duration-500 overflow-hidden relative ${isEditing ? 'border-purple-500/40 bg-purple-500/5 shadow-2xl shadow-purple-500/5 scale-[1.01]' : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'}`}>
            <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <button
              onClick={() => toggleHabit(habit.id, isCompleted)}
              disabled={isLoading}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border scale-100 active:scale-90 shrink-0
                ${isCompleted ? 'bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-black/20 border-white/10 text-transparent hover:border-purple-400'}`}
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Check className="w-5 h-5 focus:scale-110" strokeWidth={3} />}
            </button>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3 p-1">
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} autoFocus className="auth-input w-full h-11 bg-black/40 border-white/10 rounded-xl px-4 text-sm font-bold text-white outline-none focus:border-purple-500/50 shadow-inner" placeholder="Название..." />
                  <div className="flex gap-2 flex-wrap">
                    <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Описание..." className="auth-input flex-1 min-w-[120px] h-10 bg-black/20 border-white/5 rounded-xl px-4 text-xs text-gray-300 outline-none focus:border-purple-500/30 shadow-inner" />
                    <input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} className="auth-input w-36 h-10 bg-black/20 border-white/5 rounded-xl px-3 text-xs text-white outline-none focus:border-purple-500/30 shadow-inner [color-scheme:dark]" />
                  </div>
                </div>
              ) : (
                <div className="transition-all duration-500">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`text-base font-black tracking-tight text-white transition-all ${isCompleted ? 'opacity-30 line-through' : ''}`}>{habit.title}</div>
                    {deadlineDate && (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${isOverdue ? 'text-red-400 border-red-500/20 bg-red-500/5' : 'text-gray-500 border-white/5 bg-white/5'}`}>
                        {deadlineDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className={`text-sm text-gray-500 font-medium tracking-wide mt-1.5 truncate ${isCompleted ? 'opacity-20' : ''}`}>{habit.description || 'Без описания'}</div>
                </div>
              )}
            </div>

            <div className="hidden md:flex flex-col items-end gap-1 shrink-0 px-4">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Серия</span>
              <span className={`text-sm font-black italic tracking-tighter ${habit.currentStreak > 0 ? 'text-orange-400 opacity-100' : 'text-gray-700 opacity-50'}`}>🔥 {habit.currentStreak} ДН.</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isEditing ? (
                <>
                  <button onClick={() => saveEdit(habit.id)} className="p-3 rounded-2xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all active:scale-95"><Save className="w-4 h-4" /></button>
                  <button onClick={() => setEditingId(null)} className="p-3 rounded-2xl bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all active:scale-95"><X className="w-4 h-4" /></button>
                </>
              ) : (
                <>
                  <button onClick={() => startEditing(habit)} className="p-3 rounded-2xl text-gray-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 active:scale-95 hover:scale-110"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteHabit(habit.id)} className="p-3 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 active:scale-95 hover:scale-110"><Trash2 className="w-4 h-4" /></button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// =============================================
// MAIN DASHBOARD PAGE (Suspense wrapper)
// =============================================
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-2xl animate-spin mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]"></div>
        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.3em] animate-pulse">Загрузка протокола...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [userImage, setUserImage] = useState<string | null>(null)

  // Persist active tab in URL ?tab=... so it survives page refresh
  const validTabs = ['dashboard', 'calendar', 'goals', 'profile']
  const tabFromUrl = searchParams.get('tab') || 'dashboard'
  const activeTab = validTabs.includes(tabFromUrl) ? tabFromUrl : 'dashboard'

  const setActiveTab = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    router.replace(`/dashboard?${params.toString()}`, { scroll: false })
  }, [searchParams, router])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchHabits()
      fetchUserProfile()
    }
  }, [session])

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits')
      if (response.ok) { const data = await response.json(); setHabits(data) }
    } catch (error) { console.error('Error fetching habits:', error) }
    finally { setLoading(false) }
  }

  // Fetch avatar from DB separately — never touches the JWT cookie
  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setUserImage(data.image || null)
      }
    } catch (error) { console.error('Error fetching profile:', error) }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-2xl animate-spin mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]"></div>
        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.3em] animate-pulse">Загрузка протокола...</p>
      </div>
    )
  }

  if (!session) return null

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Твой Пульс', subtitle: 'Мгновенный отчет о твоем прогрессе за текущий период.' },
    calendar: { title: 'Архив активности', subtitle: 'Детальная карта твоих достижений по дням календаря.' },
    goals: { title: 'Ядро целей', subtitle: 'Организуй свои стремления и отслеживай их эволюцию.' },
    profile: { title: 'Личный кабинет', subtitle: 'Управление идентификатором и настройками безопасности.' }
  }

  // Merge session user with separately fetched image
  const userWithImage = { ...session.user, image: userImage }

  return (
    <div className="h-screen bg-[#020108] text-white font-sans selection:bg-purple-500/30 selection:text-white overflow-hidden flex flex-col">
      {/* Background Blobs — fixed, purely decorative */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[25%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[160px] animate-[auth-blob-1_25s_infinite]"></div>
        <div className="absolute bottom-[0%] right-[5%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] animate-[auth-blob-2_30s_infinite]"></div>
        <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] animate-[auth-blob-3_20s_infinite]"></div>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Header user={userWithImage} signOut={signOut} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main scrollable area — ONLY this scrolls */}
      <main className="lg:ml-64 mt-20 flex-1 overflow-y-auto relative z-10 p-8">
        {/* Page Title & Actions */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-16 gap-8 animate-[auth-entrance_0.4s_ease-out_both] delay-75">
          <div className="relative max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-white via-white to-gray-500 text-transparent bg-clip-text tracking-tighter inline-block relative pr-8 leading-tight" style={{ letterSpacing: '-0.04em' }}>
              {tabTitles[activeTab]?.title}
            </h1>
            <p className="text-sm text-gray-500 mt-3 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-px bg-purple-500/50"></span>
              {tabTitles[activeTab]?.subtitle}
            </p>
          </div>

          {activeTab === 'dashboard' && (
            <div className="flex gap-4 self-end xl:self-auto shrink-0">
              <AddHabitButton onHabitAdded={fetchHabits} />
            </div>
          )}
        </div>

        {/* TAB: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="animate-[auth-entrance_0.6s_ease-out_both] delay-200">
            <QuickStats habits={habits} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="rounded-[40px] border border-white/5 bg-[#0a0a0a]/40 backdrop-blur-2xl p-8 md:p-10 relative group overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] group-hover:bg-purple-500/10 transition-all"></div>
                  <div className="flex justify-between items-center mb-10 px-2 relative z-10">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-1">Ядро задач</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Твои вызовы на сегодня</p>
                    </div>
                  </div>
                  <EditableHabitList habits={habits} onHabitUpdated={fetchHabits} />
                </div>
              </div>

              {/* Widgets Column */}
              <div className="space-y-8">
                <div className="rounded-[40px] border border-white/5 bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-[#050505] p-10 relative overflow-hidden shadow-2xl border-t border-t-white/10">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-[60px]"></div>
                  <div className="relative z-10">
                    <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-6">Продуктивность</h3>
                    <div className="flex items-end gap-3 mb-4 flex-wrap">
                      <div className="text-6xl font-black text-white tracking-tighter">84<span className="text-2xl text-purple-500">%</span></div>
                      <div className="text-sm text-green-400 font-black mb-3 underline decoration-double decoration-green-900">+2.4</div>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-6 group cursor-help">
                      <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 w-[84%] rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]"></div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Твой уровень концентрации сегодня выше обычного. Используй этот импульс.</p>
                  </div>
                </div>

                <div className="rounded-[40px] border border-white/5 bg-[#0a0a0a]/40 p-8">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 px-2">Сигналы</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-[18px] bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg active:scale-95 shrink-0"><Droplets className="w-6 h-6" strokeWidth={1.5} /></div>
                      <div><div className="text-base font-black text-white group-hover:text-blue-300 transition-colors tracking-tight">Гидратация</div><div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">14:00 • 500мл</div></div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-[18px] bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all shadow-lg active:scale-95 shrink-0"><Activity className="w-6 h-6" strokeWidth={1.5} /></div>
                      <div><div className="text-base font-black text-white group-hover:text-pink-300 transition-colors tracking-tight">Активность</div><div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">18:30 • Ср, Пт</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Calendar */}
        {activeTab === 'calendar' && <CalendarView habits={habits} />}

        {/* TAB: Goals */}
        {activeTab === 'goals' && <GoalsView habits={habits} onHabitUpdated={fetchHabits} />}

        {/* TAB: Profile */}
        {activeTab === 'profile' && <ProfileView user={userWithImage} habits={habits} onImageUploaded={fetchUserProfile} />}
      </main>
    </div>
  )
}

// =============================================
// PROFILE VIEW
// =============================================
function ProfileView({ user, habits, onImageUploaded }: { user: any, habits: any[], onImageUploaded: () => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const totalGoals = habits.length
  const maxStreak = habits.reduce((max: number, h: any) => Math.max(max, h.currentStreak || 0), 0)

  const avgRate = habits.length > 0
    ? habits.reduce((sum: number, h: any) => sum + (h.completionRate || 0), 0) / habits.length
    : 0

  let rating = 'C'
  let ratingColor = 'text-gray-400'
  if (avgRate >= 95) { rating = 'S+'; ratingColor = 'text-purple-400' }
  else if (avgRate >= 80) { rating = 'A'; ratingColor = 'text-green-400' }
  else if (avgRate >= 60) { rating = 'B'; ratingColor = 'text-blue-400' }

  // Display: preview (optimistic) > user.image (from DB) > fallback
  const displayImage = previewImage || user?.image

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      alert("Изображение слишком большое (макс 1Мб)")
      return
    }

    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string
      try {
        setIsUploading(true)
        // Optimistic preview
        setPreviewImage(base64)

        // Save to DB
        const res = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        })

        if (!res.ok) {
          setPreviewImage(null)
          throw new Error('Failed to update')
        }

        // Refresh profile data in parent
        onImageUploaded()

      } catch (err) {
        console.error(err)
        alert("Ошибка загрузки")
      }
      finally { setIsUploading(false) }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="max-w-4xl animate-[auth-entrance_0.5s_ease-out_both] pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-[40px] border border-white/5 bg-[#0a0a0a]/40 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] group-hover:bg-purple-500/10 transition-all duration-700"></div>

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 flex-wrap">
              {/* Avatar Upload */}
              <div className="relative group/avatar cursor-pointer shrink-0">
                <div className="w-32 h-32 rounded-[32px] bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px] shadow-2xl shadow-purple-500/20">
                  <div className="w-full h-full rounded-[30px] bg-[#0a0a0a] flex items-center justify-center overflow-hidden relative">
                    {displayImage ? (
                      <img src={displayImage} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover/avatar:scale-105" />
                    ) : (
                      <span className="text-4xl font-black text-white">{user?.name?.[0]}</span>
                    )}

                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-1">
                      <Camera className="w-8 h-8 text-white" strokeWidth={1.5} />
                      <span className="text-[10px] uppercase font-bold text-white/80">Загрузить</span>
                    </div>

                    {isUploading && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </div>

              <div className="text-center md:text-left min-w-0">
                <h2 className="text-4xl font-black bg-gradient-to-b from-white to-gray-500 text-transparent bg-clip-text tracking-tighter" style={{ letterSpacing: '-0.04em' }}>{user?.name}</h2>
                <div className="flex items-center gap-2 mt-3 text-gray-500 font-bold uppercase text-xs tracking-widest justify-center md:justify-start flex-wrap">
                  <Mail className="w-3.5 h-3.5 text-purple-500 shrink-0" /> <span className="truncate">{user?.email}</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-4 py-1.5 rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-purple-500/5">
                    <Shield className="w-3 h-3" /> Уровень {Math.floor(totalGoals / 5) + 1}
                  </span>
                  <span className="px-4 py-1.5 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">Standard Plan</span>
                </div>
              </div>
            </div>

            {/* Dynamic Glassmorphism Stats — flex-wrap */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-10 border-t border-white/5">
              {[
                { label: 'Всего Целей', val: totalGoals, color: 'text-purple-400', icon: Target },
                { label: 'Лучший Стрик', val: maxStreak, color: 'text-orange-400', icon: Flame },
                { label: 'Чат (мин)', val: '—', color: 'text-blue-400', icon: Bot },
                { label: 'Рейтинг', val: rating, color: ratingColor, icon: Activity },
              ].map(stat => (
                <div key={stat.label} className="group/stat relative p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all hover:scale-[1.02]">
                  <div className={`absolute right-3 top-3 opacity-20 group-hover/stat:opacity-50 transition-all ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">{stat.label}</div>
                  <div className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Protection (de-emphasized), NO logout button here */}
        <div className="space-y-6">
          <div className="rounded-[36px] p-6 bg-[#0a0a0a]/60 border border-white/5 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>

            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5 text-gray-400 group-hover:text-purple-400 transition-colors">
              <Shield className="w-6 h-6" strokeWidth={1.5} />
            </div>

            <h4 className="text-xs font-black text-gray-300 tracking-widest uppercase mb-2">Защита Q-Habit</h4>
            <p className="text-[10px] text-gray-600 leading-relaxed font-bold uppercase tracking-widest">
              Данные зашифрованы
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}