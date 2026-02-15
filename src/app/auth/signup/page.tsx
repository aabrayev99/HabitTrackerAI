'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input, Button, Link, Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react"

const signupSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
  confirmPassword: z.string().min(1, 'Подтверждение пароля обязательно'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>()

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    setError('')

    try {
      // Регистрируем пользователя
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Ошибка при регистрации')
        return
      }

      // Автоматически входим после регистрации
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError('Регистрация прошла успешно, но не удалось войти в систему')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('Произошла ошибка при регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-6">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h2 className="text-2xl font-bold">Создать аккаунт</h2>
          <p className="text-small text-default-500">
            Заполните форму для регистрации
          </p>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('name')}
              isRequired
              label="Имя"
              placeholder="Введите ваше имя"
              type="text"
              autoComplete="name"
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name}
              variant="bordered"
            />

            <Input
              {...register('email')}
              isRequired
              label="Email"
              placeholder="Введите ваш email"
              type="email"
              autoComplete="email"
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email}
              variant="bordered"
            />

            <Input
              {...register('password')}
              isRequired
              label="Пароль"
              placeholder="Придумайте пароль"
              type="password"
              autoComplete="new-password"
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              variant="bordered"
            />

            <Input
              {...register('confirmPassword')}
              isRequired
              label="Подтверждение"
              placeholder="Повторите пароль"
              type="password"
              autoComplete="new-password"
              errorMessage={errors.confirmPassword?.message}
              isInvalid={!!errors.confirmPassword}
              variant="bordered"
            />

            {error && (
              <div className="rounded-medium bg-danger-50 p-3 text-danger text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              Создать аккаунт
            </Button>
          </form>
        </CardBody>
        <Divider className="my-2" />
        <CardFooter className="justify-center">
          <p className="text-small text-default-500">
            Уже есть аккаунт?{' '}
            <Link as={NextLink} href="/auth/signin" size="sm" color="primary">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}