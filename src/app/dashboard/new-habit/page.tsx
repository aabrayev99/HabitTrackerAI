'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardBody, CardFooter, Button, Input, Textarea, Select, SelectItem, Divider } from '@heroui/react'
import NextLink from 'next/link'

interface HabitFormData {
    title: string
    description: string
    frequency: 'daily' | 'weekly' | 'custom'
    tags: string
}

export default function NewHabitPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

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
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader className="flex flex-col gap-1 items-center pb-0">
                    <h2 className="text-2xl font-bold">Новая привычка</h2>
                    <p className="text-small text-default-500">Заполните детали вашей новой привычки</p>
                </CardHeader>
                <CardBody className="py-4">
                    <form id="habit-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input
                            label="Название"
                            placeholder="Например: Выпить стакан воды"
                            variant="bordered"
                            isRequired
                            {...register('title', { required: 'Название обязательно' })}
                            isInvalid={!!errors.title}
                            errorMessage={errors.title?.message}
                        />

                        <Textarea
                            label="Описание"
                            placeholder="Дополнительные детали о привычке"
                            variant="bordered"
                            {...register('description')}
                        />

                        <Controller
                            name="frequency"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select
                                    label="Частота"
                                    variant="bordered"
                                    placeholder="Выберите частоту"
                                    selectedKeys={field.value ? [field.value] : []}
                                    onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
                                >
                                    <SelectItem key="daily">Ежедневно</SelectItem>
                                    <SelectItem key="weekly">Еженедельно</SelectItem>
                                    <SelectItem key="custom">Другое</SelectItem>
                                </Select>
                            )}
                        />

                        <Input
                            label="Теги (необязательно)"
                            placeholder="здоровье, спорт, утро (через запятую)"
                            variant="bordered"
                            {...register('tags')}
                        />
                    </form>
                </CardBody>
                <Divider />
                <CardFooter className="flex justify-between pt-4">
                    <Button
                        as={NextLink}
                        href="/dashboard"
                        color="danger"
                        variant="light"
                    >
                        Отмена
                    </Button>
                    <Button
                        form="habit-form"
                        type="submit"
                        color="primary"
                        isLoading={isLoading}
                    >
                        Создать
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
