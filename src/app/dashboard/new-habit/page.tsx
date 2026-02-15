'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface HabitFormData {
    title: string
    description: string
    frequency: 'daily' | 'weekly' | 'custom'
    tags: string
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

            const frequency = data.frequency || 'daily';

            const response = await fetch('/api/habits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description || undefined,
                    frequency: frequency,
                    tags,
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
            alert('Ошибка при создании привычки')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold justify-center">Новая привычка</h2>
                    <p className="text-center text-sm text-base-content/70">Заполните детали вашей новой привычки</p>

                    <form id="habit-form" onSubmit={handleSubmit(onSubmit)} className="form-control gap-4 mt-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Название</span>
                            </label>
                            <input
                                {...register('title', { required: 'Название обязательно' })}
                                type="text"
                                placeholder="Например: Выпить стакан воды"
                                className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                            />
                            {errors.title && (
                                <span className="label-text-alt text-error mt-1">{errors.title.message}</span>
                            )}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Описание</span>
                            </label>
                            <textarea
                                {...register('description')}
                                className="textarea textarea-bordered w-full"
                                placeholder="Дополнительные детали о привычке"
                            ></textarea>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Частота</span>
                            </label>
                            <Controller
                                name="frequency"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <select
                                        className="select select-bordered w-full"
                                        {...field}
                                    >
                                        <option value="daily">Ежедневно</option>
                                        <option value="weekly">Еженедельно</option>
                                        <option value="custom">Другое</option>
                                    </select>
                                )}
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Теги (необязательно)</span>
                            </label>
                            <input
                                {...register('tags')}
                                type="text"
                                placeholder="здоровье, спорт, утро (через запятую)"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="card-actions justify-end mt-4">
                            <Link href="/dashboard" className="btn btn-ghost">Отмена</Link>
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading && <span className="loading loading-spinner"></span>}
                                Создать
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
