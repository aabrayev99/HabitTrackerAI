'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, Sparkles, Calendar } from 'lucide-react'

interface HabitFormData {
    title: string
    description: string
    frequency: 'daily' | 'weekly' | 'custom'
    tags: string
    endDate?: string
}

export default function NewHabitPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<HabitFormData>({
        defaultValues: {
            frequency: 'daily'
        }
    })

    const onSubmit = async (data: HabitFormData) => {
        setIsLoading(true)

        try {
            const tags = data.tags
                ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                : []

            const response = await fetch('/api/habits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description || undefined,
                    frequency: data.frequency,
                    tags,
                    endDate: data.endDate || undefined
                }),
            })

            if (response.ok) {
                router.push('/dashboard')
                router.refresh()
            } else {
                const errorData = await response.json()
                alert(errorData.message || 'Ошибка при создании привычки')
            }
        } catch (error) {
            console.error('Error creating habit:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#030014] text-white font-sans selection:bg-purple-500 selection:text-white">

            {/* ====== AMBIENT BACKGROUND ====== */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[120px] animate-[auth-blob-1_20s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-blue-700/10 rounded-full blur-[100px] animate-[auth-blob-2_25s_ease-in-out_infinite]"></div>
            </div>

            {/* ====== FIXED HEADER ====== */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-transparent backdrop-blur-[10px] border-b border-white/5">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">Q</div>
                    <span className="text-lg font-bold tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Q-Habit</span>
                    </span>
                </Link>
                <Link
                    href="/dashboard"
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Назад к дашборду
                </Link>
            </header>

            {/* ====== FORM CONTENT ====== */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24 pb-12">
                <div className="w-full max-w-[520px] animate-[auth-entrance_0.6s_ease-out_both]">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-300 font-bold uppercase tracking-widest mb-4">
                            <Plus className="w-3 h-3" /> Новая Цель
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-gray-400 text-transparent bg-clip-text tracking-tight mb-2" style={{ letterSpacing: '-0.03em' }}>
                            Создай свою привычку
                        </h1>
                        <p className="text-gray-500 text-sm">Маленькие шаги ведут к большим переменам</p>
                    </div>

                    {/* Glassmorphism Card */}
                    <div className="rounded-3xl p-8 border border-white/10" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Название привычки</label>
                                <div className="relative">
                                    <input
                                        {...register('title', { required: 'Название обязательно' })}
                                        type="text"
                                        placeholder="Напр: Утренняя медитация"
                                        className={`auth-input w-full h-12 rounded-2xl px-5 text-sm text-white placeholder-gray-600 transition-all outline-none border focus:border-purple-500/50 ${errors.title ? 'border-red-500/50' : 'border-white/5'}`}
                                    />
                                    <Sparkles className="absolute right-4 top-3.5 w-4 h-4 text-purple-500/30" />
                                </div>
                                {errors.title && <p className="text-red-400 text-[10px] font-medium ml-1">{errors.title.message}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Описание (необязательно)</label>
                                <textarea
                                    {...register('description')}
                                    placeholder="Почему это важно для вас?"
                                    className="auth-input w-full min-h-[100px] rounded-2xl p-5 text-sm text-white placeholder-gray-600 transition-all outline-none border border-white/5 focus:border-purple-500/50 resize-none"
                                />
                            </div>

                            {/* Frequency & Deadline Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Частота</label>
                                    <Controller
                                        name="frequency"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="relative">
                                                <select
                                                    {...field}
                                                    className="auth-input w-full h-12 rounded-2xl px-5 text-sm text-white transition-all outline-none border border-white/5 focus:border-purple-500/50 appearance-none cursor-pointer"
                                                >
                                                    <option value="daily">Ежедневно</option>
                                                    <option value="weekly">Еженедельно</option>
                                                    <option value="custom">По выбору</option>
                                                </select>
                                                <div className="absolute right-4 top-4 pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor font-medium"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Срок (Дедлайн)</label>
                                    <div className="relative">
                                        <input
                                            {...register('endDate')}
                                            type="date"
                                            className="auth-input w-full h-12 rounded-2xl px-5 text-sm text-white placeholder-gray-600 transition-all outline-none border border-white/5 focus:border-purple-500/50 [color-scheme:dark]"
                                        />
                                        <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Теги</label>
                                <input
                                    {...register('tags')}
                                    type="text"
                                    placeholder="Спорт, Здоровье..."
                                    className="auth-input w-full h-12 rounded-2xl px-5 text-sm text-white placeholder-gray-600 transition-all outline-none border border-white/5 focus:border-purple-500/50"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Link
                                    href="/dashboard"
                                    className="flex-1 h-14 rounded-2xl border border-white/5 flex items-center justify-center text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Отмена
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 italic" fill="currentColor" />
                                            Создать Привычку
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-[0.2em]">
                        Powered by Q-Habit Intelligence
                    </p>
                </div>
            </div>
        </div>
    )
}
