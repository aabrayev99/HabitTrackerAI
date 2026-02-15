'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input, Button, Link, Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react"

const signinSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Пароль обязателен'),
})

type SigninFormData = z.infer<typeof signinSchema>

export default function SigninPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>()

  const onSubmit = async (data: SigninFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Неверный email или пароль')
      } else {
        // Успешный вход
        await getSession()
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('Произошла ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-6">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h2 className="text-2xl font-bold">Войти в аккаунт</h2>
          <p className="text-small text-default-500">
            Введите свои данные для входа
          </p>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="Введите ваш пароль"
              type="password"
              autoComplete="current-password"
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
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
              Войти
            </Button>
          </form>
        </CardBody>
        <Divider className="my-2" />
        <CardFooter className="justify-center">
          <p className="text-small text-default-500">
            Нет аккаунта?{' '}
            <Link as={NextLink} href="/auth/signup" size="sm" color="primary">
              Зарегистрироваться
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}